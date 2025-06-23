const arabicNameRegex = /^[\u0600-\u06FF\s.'"-]+$/
const digitRegex = /^\d+$/
const phoneRegex = /^01(0|1|2|4|5)\d{8}$/
const globalPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

export type RuleType = {
  rule: RegExp,
  message: string
}
const generalRules = {
  arabicNameRegex: {
    rule: arabicNameRegex,
    message: 'يجب أن يكون البيان باللغة العربية'
  },
  digitRegex: {
    rule: digitRegex,
    message: "يجب أن تكون القيمة رقمية"
  },
  phoneRegex: {
    rule: phoneRegex,
    message: "رقم الهاتف غير صالح"
  },
  globalPhoneRegex: {
    rule: globalPhoneRegex,
    message: "رقم الهاتف الدولي غير صالح"
  },
}
export default generalRules

// export const RegisterFormSchema = z
//   .object({
//     email: z.string().email({ message: "Please enter a valid email." }).trim(),
//     password: z
//       .string()
//       .min(1, { message: "Not be empty" })
//       .min(5, { message: "Be at least 5 characters long" })
//       .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
//       .regex(/[0-9]/, { message: "Contain at least one number." })
//       .regex(/[^a-zA-Z0-9]/, {
//         message: "Contain at least one special character.",
//       })
//       .trim(),
//     confirmPassword: z.string().trim(),
//   })
//   .superRefine((val, ctx) => {
//     if (val.password !== val.confirmPassword) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Password fields do not match.",
//         path: ["confirmPassword"],
//       });
//     }
//   });