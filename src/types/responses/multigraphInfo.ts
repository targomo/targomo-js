import { BoundingBox } from '..';

export interface MultigraphInfo {

  /**
   * id of the multigraph
   */
  id?: number

  /**
   * Number of sources used in the MG layer
   */
  amountSources: number

  /**
   * one of(CERATED,ROUTING,MERGING,AGGREGATING,COMPLETED,FAILED)
   */
  status: MultigraphStatus

  /**
   * 0 when CREATED, 0-1 when ROUTING, 1 when MERGING,AGGREGATING,COMPLETED
   */
  routingProgress: number

  /**
   * if this list contains more than one elements the aggregation values "may" be not absolutely correct (due to merging of the graphs)
   * - can be mitigated with executing "redo" (which completely restarts the whole process for the aggregation
   * - this value is set in MERGING, AGGREGATING, and COMPLETED
   */
  baseGraphIds?: number[]

  /**
   * only set when FAILED
   */
  errorMessage?: string

  /**
   * only set when COMPLETED
   */
  minValue?: number

  /**
   * only set when COMPLETED
   */
  maxValue?: number


  /**
   * travelOptions, that were used for this request. (only if detailed flag is used)
  */
  travelOptions?: any

  /**
   * bbox of mg layer
  */
  boundingBox?: BoundingBox
}

/**
 * Lifecycle of a Multigraph:
 *
 * 1. CREATED
 * 2. ROUTING
 * 3. MERGING
 * 4. AGGREGATING
 * 5. COMPLETED / FAILED
 */
export enum MultigraphStatus {
  CREATED = 'CREATED',
  ROUTING = 'ROUTING',
  MERGING = 'MERGING',
  AGGREGATING = 'AGGREGATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
