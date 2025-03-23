# Issues

### Error in register useAuthStore: [TypeError: cyclical structure in JSON object]

- issue came about after console.logging and seeing username be an object. turns out, in the <TextInput>, we had an attribute `onChange` instead of the actual attribute we should be using of `onChangeText`
