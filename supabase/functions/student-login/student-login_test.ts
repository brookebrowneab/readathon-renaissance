 import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
 import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
 
 // Generate a bcrypt hash for testing and print it
 Deno.test("generate test password hash", async () => {
   const password = "reading123";
   const salt = await bcrypt.genSalt(12);
   const hash = await bcrypt.hash(password, salt);
   console.log("Generated bcrypt hash for 'reading123':", hash);
   
   // Verify it works
   const isValid = await bcrypt.compare(password, hash);
   assertEquals(isValid, true);
 });
 
 Deno.test("verify password function works with bcrypt", async () => {
   const password = "reading123";
   const hash = await bcrypt.hash(password, await bcrypt.genSalt(12));
   
   const isValid = await bcrypt.compare(password, hash);
   assertEquals(isValid, true);
   
   const isInvalid = await bcrypt.compare("wrongpassword", hash);
   assertEquals(isInvalid, false);
 });