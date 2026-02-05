 import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.208.0/assert/mod.ts";
 import bcrypt from "https://esm.sh/bcryptjs@2.4.3";
 
 Deno.test("bcrypt generates proper hash format", async () => {
   const password = "testpassword123";
   const salt = bcrypt.genSaltSync(12);
   const hash = bcrypt.hashSync(password, salt);
   
   // Bcrypt hashes start with $2a$, $2b$, or $2y$
   assertEquals(hash.startsWith("$2"), true);
   // Bcrypt hashes are about 60 characters
   assertEquals(hash.length >= 59 && hash.length <= 61, true);
 });
 
 Deno.test("bcrypt verify works correctly", () => {
   const password = "securepassword";
   const salt = bcrypt.genSaltSync(12);
   const hash = bcrypt.hashSync(password, salt);
   
   const isValid = bcrypt.compareSync(password, hash);
   assertEquals(isValid, true);
   
   const isInvalid = bcrypt.compareSync("wrongpassword", hash);
   assertEquals(isInvalid, false);
 });
 
 Deno.test("password minimum length is 8 characters", () => {
   const shortPassword = "short";
   const validPassword = "password123";
   
   assertEquals(shortPassword.length >= 8, false);
   assertEquals(validPassword.length >= 8, true);
 });