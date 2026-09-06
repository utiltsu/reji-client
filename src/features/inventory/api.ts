import { apiClient } from "../../lib/api-client";
import {
  leftoverResponseSchema,
  productionBatchResponseSchema,
  recordLeftoverInputSchema,
  recordProductionBatchInputSchema,
  type RecordLeftoverInput,
  type RecordProductionBatchInput,
} from "./schemas";

export async function recordProductionBatch(input: RecordProductionBatchInput) {
  const payload = recordProductionBatchInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>("/api/bff/production-batches", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return productionBatchResponseSchema.parse(response);
}

export async function recordLeftover(input: RecordLeftoverInput) {
  const payload = recordLeftoverInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>("/api/bff/leftover-records", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return leftoverResponseSchema.parse(response);
}
