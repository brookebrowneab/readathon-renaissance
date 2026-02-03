import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId?: string) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: (options?: CardOptions) => Promise<SquareCard>;
}

interface CardOptions {
  style?: Record<string, unknown>;
}

interface SquareCard {
  attach: (elementId: string) => Promise<void>;
  tokenize: () => Promise<TokenizeResult>;
  destroy: () => void;
}

interface TokenizeResult {
  status: "OK" | "ERROR";
  token?: string;
  errors?: Array<{ message: string }>;
}

interface UseSquarePaymentOptions {
  onReady?: () => void;
  onError?: (error: string) => void;
}

interface ProcessPaymentParams {
  amount: number;
  pledgeIds?: string[];
  classPledgeId?: string;
  payerName: string;
  payerEmail: string;
}

interface ProcessPaymentResult {
  success: boolean;
  paymentId?: string;
  receiptUrl?: string;
  error?: string;
}

// Square Sandbox Application ID - will be replaced with real one from secrets
// For sandbox testing, we use a fallback; in production, this comes from VITE env
const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || "sandbox-sq0idb-PLACEHOLDER";

export function useSquarePayment(options: UseSquarePaymentOptions = {}) {
  const { onReady, onError } = options;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cardRef = useRef<SquareCard | null>(null);
  const mountedRef = useRef(true);

  // Load Square Web Payments SDK
  useEffect(() => {
    mountedRef.current = true;
    
    const loadSquareScript = async () => {
      // Check if already loaded
      if (window.Square) {
        await initializeCard();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
      script.async = true;
      
      script.onload = async () => {
        if (mountedRef.current) {
          await initializeCard();
        }
      };
      
      script.onerror = () => {
        if (mountedRef.current) {
          const err = "Failed to load Square payment SDK";
          setError(err);
          setIsLoading(false);
          onError?.(err);
        }
      };

      document.body.appendChild(script);
    };

    loadSquareScript();

    return () => {
      mountedRef.current = false;
      if (cardRef.current) {
        try {
          cardRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        cardRef.current = null;
      }
    };
  }, []);

  const initializeCard = async () => {
    if (!window.Square) {
      const err = "Square SDK not available";
      setError(err);
      setIsLoading(false);
      onError?.(err);
      return;
    }

    try {
      const payments = await window.Square.payments(SQUARE_APP_ID);
      const card = await payments.card({
        style: {
          ".input-container": {
            borderColor: "hsl(var(--border))",
            borderRadius: "0.5rem",
          },
          ".input-container.is-focus": {
            borderColor: "hsl(var(--ring))",
          },
          ".input-container.is-error": {
            borderColor: "hsl(var(--destructive))",
          },
          input: {
            backgroundColor: "transparent",
            color: "hsl(var(--foreground))",
            fontFamily: "inherit",
          },
          "input::placeholder": {
            color: "hsl(var(--muted-foreground))",
          },
        },
      });

      // Store reference before attaching
      cardRef.current = card;
      
      // Wait for DOM element to be available
      await new Promise<void>((resolve) => {
        const checkElement = () => {
          if (document.getElementById("square-card-container")) {
            resolve();
          } else {
            requestAnimationFrame(checkElement);
          }
        };
        checkElement();
      });

      await card.attach("#square-card-container");

      if (mountedRef.current) {
        setIsReady(true);
        setIsLoading(false);
        onReady?.();
      }
    } catch (e) {
      if (mountedRef.current) {
        const err = e instanceof Error ? e.message : "Failed to initialize card form";
        setError(err);
        setIsLoading(false);
        onError?.(err);
      }
    }
  };

  const processPayment = useCallback(
    async (params: ProcessPaymentParams): Promise<ProcessPaymentResult> => {
      const { amount, pledgeIds, classPledgeId, payerName, payerEmail } = params;

      if (!cardRef.current) {
        return { success: false, error: "Card form not initialized" };
      }

      setIsProcessing(true);

      try {
        // Tokenize the card
        const tokenResult = await cardRef.current.tokenize();

        if (tokenResult.status !== "OK" || !tokenResult.token) {
          const errorMsg = tokenResult.errors?.[0]?.message || "Card verification failed";
          return { success: false, error: errorMsg };
        }

        // Generate idempotency key
        const idempotencyKey = crypto.randomUUID();

        // Call our edge function to process the payment
        const { data, error: fnError } = await supabase.functions.invoke(
          "process-square-payment",
          {
            body: {
              sourceId: tokenResult.token,
              amount,
              pledgeIds,
              classPledgeId,
              payerName,
              payerEmail,
              idempotencyKey,
            },
          }
        );

        if (fnError) {
          console.error("Edge function error:", fnError);
          return { success: false, error: fnError.message || "Payment processing failed" };
        }

        if (!data?.success) {
          return { success: false, error: data?.error || "Payment failed" };
        }

        return {
          success: true,
          paymentId: data.paymentId,
          receiptUrl: data.receiptUrl,
        };
      } catch (e) {
        console.error("Payment error:", e);
        return {
          success: false,
          error: e instanceof Error ? e.message : "An unexpected error occurred",
        };
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    isLoading,
    isReady,
    error,
    isProcessing,
    processPayment,
  };
}