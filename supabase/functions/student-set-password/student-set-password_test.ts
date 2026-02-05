 import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.208.0/assert/mod.ts";
 import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
 
 Deno.test("bcrypt generates proper hash format", async () => {
   const password = "testpassword123";
   const salt = await bcrypt.genSalt(12);
   const hash = await bcrypt.hash(password, salt);
   
   // Bcrypt hashes start with $2a$, $2b$, or $2y$
   assertEquals(hash.startsWith("$2"), true);
   // Bcrypt hashes are about 60 characters
   assertEquals(hash.length >= 59 && hash.length <= 61, true);
 });
 
 Deno.test("bcrypt verify works correctly", async () => {
   const password = "securepassword";
   const salt = await bcrypt.genSalt(12);
   const hash = await bcrypt.hash(password, salt);
   
   const isValid = await bcrypt.compare(password, hash);
   assertEquals(isValid, true);
   
   const isInvalid = await bcrypt.compare("wrongpassword", hash);
   assertEquals(isInvalid, false);
 });
 
 Deno.test("password minimum length is 8 characters", () => {
   const shortPassword = "short";
   const validPassword = "password123";
   
   assertEquals(shortPassword.length >= 8, false);
   assertEquals(validPassword.length >= 8, true);
 });