import { REGIONS } from "./regions"
import type { Filters } from "./types/filter-types"

enum ValidateState {
  OK,
  FAILED,
}

interface ValidateResult {
  state: ValidateState
  message?: string
}

const OkResult: ValidateResult = { state: ValidateState.OK }
const FailedResult = (message: string) => ({
  state: ValidateState.FAILED,
  message,
})

const validateRegion = (filters: Filters) =>
  filters.region in REGIONS
    ? OkResult
    : FailedResult(`Region does not exist : '${filters.region}'`)

const validators: ((filters: Filters) => ValidateResult)[] = [validateRegion]

export const validateFilters = (filters: Filters) =>
  validators
    .map((f) => f(filters))
    .filter((e) => e.state === ValidateState.FAILED)
