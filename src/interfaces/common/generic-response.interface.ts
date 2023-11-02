export interface GenericResponse<T> {
    result: DBResponse<T>
    statusCode: number
    message: string
  }

export interface GenericResponseWithOutRecordSet<T> {
    result: T
    statusCode: number
    message: string
  }

export interface DBResponse<T> {
    recordsets: T[]
    recordset: T[]
    output: any
    rowsAffected: number[]
    returnValue: number
  }
