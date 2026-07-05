import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.create': { paramsTuple?: []; params?: {} }
    'messages.store': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.react': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
    'admin.messages.toggleActive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.messages.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.create': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.create': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'messages.store': { paramsTuple?: []; params?: {} }
    'messages.react': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.messages.toggleActive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.messages.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}