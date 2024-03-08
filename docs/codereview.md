## Code review guildlines

### Introduction

Code reviews are an essential part of our development process. They help ensure code quality, maintainability, and adherence to best practices. This document outlines our code review process and provides guidelines for conducting effective reviews.

### Best practices for code reviews

#### 1. Tools

- Using a graphical user interface (GUI) desktop client to open pull requests (PRs) can indeed make code review easier and more intuitive. For instance :- Sourcetree, github destop etc. 
- Most GUI clients offer a side-by-side diff view, allowing reviewers to see the differences between the changed files and their previous versions
- GUI clients typically support inline commenting, where reviewers can leave comments directly on specific lines of code.

### 2. Verify feature requirements

-  Verify that the code addresses all the requirements specified in the user stories or requirements document. Ensure that      all expected features, functionality, and edge cases are implemented as described.
-  ask yourself: 
--  Is there any missing functionality?
--  Are there any poorly implemented functions?
--  Could they add any related functions the user would like?
-- Does it avoid obscure language?

### 3. Test maintainability
- You want to ensure that it is structured, organized, and documented in a way that makes it easy to understand, modify, and extend in the future.
- Evaluate the readability of the code by checking variable names, function names, and comments.
- Ask yourself:
-- Is the code easy to test and debug?
-- Does the code rely on functions or technology you want to phase out?

### 4. Speed and performance

- The code is optimized to execute efficiently and doesn't introduce unnecessary overhead or bottlenecks.
- Consider reusable services, functions and components.
- Check for memory leaks or excessive memory usage in the code.
- Consider asynchronous or non-blocking I/O where applicable to improve responsiveness.
- Avoid nested loops or excessive iterations over large datasets.
- Consider memoization techniques to cache intermediate results and avoid redundant calculations.
- Optimize code splitting strategies to ensure efficient chunk creation and loading
- Evaluate the performance impact of external dependencies or third-party libraries used in the code.

### 5. Inspect naming conventions
- Have you reviewed the names of variables, constants, properties, and methods?
- Are the names simple and legible?
- Do the names fit your business’s naming conventions?
- Do the names convey what a function or variable is?
- Do the names explain the context or scope of the overall codebase?

### 6. Keep pull requests small
- It's almost always possible to split a large change into smaller chunks—for example, with a separate refactoring PR that sets the stage for a cleaner implementation. Practicing slicing also helps to detect minimal shippable increments of your product.


### 7. Optimize for the team
- Speedy reviews increase team performance in multiple ways: iteration becomes faster, developers don't need to do time-costly context switches as often, etc.
- Make sure the team understands the implications of fast reviews and agrees on a suitable maximum time for responding to a PR
- Sometimes a proof-of-concept implementation is needed to ignite the discussion.
- Clearly define the roles and responsibilities of each team member involved in the review process.


### 8. Plan Enough Time
- Instead of having marathon review sessions lasting 60 minutes or more, consider breaking them into shorter, focused sessions. Aim for review sessions of 30 minutes to maintain reviewer focus and attention.
- Don't overwhelm yourself, it's best to inspect less than 300-500 lines of code per hour.

### 9. Start with good, Make it better
- Get to better code reviews by continuously improving on the details, but also start looking at changes at a high level as well. Be empathetic in the tone of comments and think of ways outside the code review process to eliminate frequent nitpicks.

### 10. Review Checklist
- Code is easily understand.
- Code is written following the coding standarts/guidelines.
- Code is in sync with existing code patterns/technologies.
- DRY (Do not Repeat Yourself) principle: Is the same code duplicated more than twice?
- Can the code be easily tested?
- Are functions/components reasonably small (not too big)?
- Naming conventions followed for variables, file names, translations.
- Removed unused packages from NPM.

### 11. Code Style 
- No hardcoded values, use constants values.
- Avoid multiple if/else blocks.
- No commented out code.
- No unnecessary comments: comments that describe the how.
- Add necessary comments where needed. Necessary comments are comments that describe the why.
- No hard coding, use constants/configuration values.
- Group similar values under an enumeration (enum).

### 12 ES6/7
- Use ES6 features.
- Use fat arrow instead of var that = this. Be consistent in your usage of arrow function.
- Use spread/rest operator.
- Use default values.
- Use const over let (avoid var).
- Use import and export.
- Use template literals.
- Use destructuring assignment for arrays and objects.
- Use Promises or Asyns/Await. Rejection is handled.

### 13 React code
- Are components have defined propTypes?
- Keep components small.
- Use Functional components, don't use class components.
- No api calls in containers.
- No state updates in loop.
- Minimize logic in the render method.
- Don’t use mixins, prefer HOC and composition.
- Is any nice/useful library or package was used wich we didn't know before?
- Remove unnecessary Effects. Reference :- `https://react.dev/learn/you-might-not-need-an-effect`
- Check missing form validations.
- Check for missing error handlers from API responses.
- Null Checks aka Defensive Code


### 14 Eslint
- Code has no any linter errors or warnings.
- No console.logs.

### 15 Styleing 
- Use styled component
- Use Hex color codes #000 unless using rgba().
- Avoid absolute positioning.
- Avoid !important.
- Do not animate width, height, top, left and others. Use transform instead.
- Avoid inline styles.

## We’ve outlined a few tips to improve your code review process: 
- Aim for actionable feedback and probing questions
-  When calling out a problem, format your response in a “We like to do X because Y” statement. Avoid comments like: “You didn’t follow our style guidelines here.” Reminding devs that you’re all working for the same team keeps morale high. 
-  Aim for objective feedback based on coding frameworks or principles. This also provides a learning culture for the author to better understand the “why” behind a certain bit of feedback. 
-  Don’t focus on every opportunity to improve code during a review. Perfection is great, but given the time and scope of a project, focus on the areas that will make the biggest impact. 






