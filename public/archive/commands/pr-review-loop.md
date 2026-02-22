# PR Review Loop

1. Check PR for comments that are not resolved or addressed.
2. If there aren't any comments, sleep for 60 secs and check again.
3. Address comments and reply with comment tagging the original commenter to notify them of the update.
4. Resolve comment, if appropriate.
5. Repeat steps 1-4 until all comments are resolved and reviewers have no pending change requests or questions.

# After loop completion

1. Output report:

```
PR Review Loop Complete
Comments resolved: X
Comments remaining: Y
```

2. Ask if another loop should be starterd.