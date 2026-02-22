# Plan Change

## Overview
Creates a multi-stage plan for applying codebase change.

## Command
1. AskUserQuestion describing the change requirements
2. Analyse change, read relevant `md` files in `specs/`, check codebase
3. AskUserQuestion, if change requirement refinement options are discovered in 2
4. Loop 2 and 3 until change requirements are satisfactory
5. Create a plan to apply the changes, include updates of specs, code, tests and quality checks
6. Create a new bead with own git worktree, use the refined change requirements and plan from 5 as description
7. Update bead status to in progress
8. Implement changes according to plan from bean
9. Commit code and open PR
10. Set bean status to in review

## Example Usage

```sh
# Launch from step 1
/plan-change

# Launch from step 2
/plan-change [step-1-string?]
```