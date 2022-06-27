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
 * @interface Event
 */
export interface Event {
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    readonly id: number;
    /**
     * 
     * @type {string}
     * @memberof Event
     */
    title: string;
    /**
     * 
     * @type {Date}
     * @memberof Event
     */
    readonly createdAt: Date;
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    readonly user: number;
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    readonly parentNode: number;
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    ownerCluster?: number | null;
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    ownerUser?: number | null;
    /**
     * 
     * @type {number}
     * @memberof Event
     */
    thread: number;
}

export function EventFromJSON(json: any): Event {
    return EventFromJSONTyped(json, false);
}

export function EventFromJSONTyped(json: any, ignoreDiscriminator: boolean): Event {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'createdAt': (new Date(json['created_at'])),
        'user': json['user'],
        'parentNode': json['parent_node'],
        'ownerCluster': !exists(json, 'owner_cluster') ? undefined : json['owner_cluster'],
        'ownerUser': !exists(json, 'owner_user') ? undefined : json['owner_user'],
        'thread': json['thread'],
    };
}

export function EventToJSON(value?: Event | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'owner_cluster': value.ownerCluster,
        'owner_user': value.ownerUser,
        'thread': value.thread,
    };
}

