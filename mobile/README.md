# Issues

### Error in register useAuthStore: [TypeError: cyclical structure in JSON object]

- issue came about after console.logging and seeing username be an object. turns out, in the <TextInput>, we had an attribute `onChange` instead of the actual attribute we should be using of `onChangeText`

### ERROR in registerUser controller E11000 duplicate key error collection: database.users index: dailyHabits.date_1 dup key: { dailyHabits.date: null }

- all I did was drop the document since I updated the schema. it's important to resolve, but there are other options

Here's a breakdown of the problem and how to fix it:

##### Understanding the Problem

- Unique Index: You have a unique index on dailyHabits.date in your User model. This means that no two documents in the users collection can have the same value for dailyHabits.date.
- dailyHabits.date: null: When you create a new user, a dailyHabits entry is being initialized with a date field set to null.
- Duplicate Key Error: The database is encountering a conflict because you're trying to insert a new user with dailyHabits.date: null, and there's already an existing user with the same null value for that field.

### Possible Causes and Solutions

Implicit Initialization:
Cause: Your User schema might be implicitly initializing dailyHabits.date to null when a new user is created.

#### Solution:

Modify your User schema to ensure dailyHabits.date is not set to null by default.
If you intend to have dailyHabits.date nullable, remove the unique index.
If you intend to have dailyHabits.date as a date, then ensure that the creation of the user, also creates a valid date, or does not create the daily habits entry at all until the user creates the first habit.

#### Explicit Initialization:

- Cause: You might be explicitly setting dailyHabits.date to null in your registerUser controller or elsewhere in your code.

##### Solution:

Review your code to find where dailyHabits is being initialized.
If you don't need dailyHabits at the time of user registration, remove the initialization.
If you do need it, set a default date, or remove the unique constraint.
Schema Definition:
Cause: The schema for the User model likely contains the definition for the dailyHabits array, and within that array, the date field has a unique constraint.
Solution:
Examine the User model schema, and remove the unique constraint from the dailyHabits.date field.
Alternatively, change the schema so that the dailyHabits field is not automatically created on user creation.
