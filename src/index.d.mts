// Purpose: Describe the public domain API.
import type{JevProvider}from"./jev.mjs";export const RISKS:readonly string[];export type Mark={id:string;name:string;goods:string;niceClasses:number[];territory:string;status:string;sourceUrl:string};export function mark(input:any):Mark;export function assessFiling(owned:any,filing:any,provider:JevProvider):Promise<any>;
