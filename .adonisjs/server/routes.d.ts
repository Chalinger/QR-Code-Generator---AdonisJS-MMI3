import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'qr_codes.index': { paramsTuple?: []; params?: {} }
    'qr_codes.create': { paramsTuple?: []; params?: {} }
    'qr_codes.store': { paramsTuple?: []; params?: {} }
    'qr_codes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qr_codes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qr_codes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qr_codes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'qr_codes.index': { paramsTuple?: []; params?: {} }
    'qr_codes.create': { paramsTuple?: []; params?: {} }
    'qr_codes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qr_codes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'qr_codes.index': { paramsTuple?: []; params?: {} }
    'qr_codes.create': { paramsTuple?: []; params?: {} }
    'qr_codes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'qr_codes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'qr_codes.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'qr_codes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'qr_codes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'qr_codes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}