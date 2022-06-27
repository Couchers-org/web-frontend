/* tslint:disable */
/* eslint-disable */
/**
 * Couchers API
 * Couchers API documentation
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface PatchedAccountDeletionReason
 */
export interface PatchedAccountDeletionReason {
    /**
     * 
     * @type {number}
     * @memberof PatchedAccountDeletionReason
     */
    readonly id?: number;
    /**
     * 
     * @type {Date}
     * @memberof PatchedAccountDeletionReason
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof PatchedAccountDeletionReason
     */
    readonly user?: number;
    /**
     * 
     * @type {string}
     * @memberof PatchedAccountDeletionReason
     */
    reason?: string | null;
}

export function PatchedAccountDeletionReasonFromJSON(json: any): PatchedAccountDeletionReason {
    return PatchedAccountDeletionReasonFromJSONTyped(json, false);
}

export function PatchedAccountDeletionReasonFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedAccountDeletionReason {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
        'user': !exists(json, 'user') ? undefined : json['user'],
        'reason': !exists(json, 'reason') ? undefined : json['reason'],
    };
}

export function PatchedAccountDeletionReasonToJSON(value?: PatchedAccountDeletionReason | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'reason': value.reason,
    };
}

