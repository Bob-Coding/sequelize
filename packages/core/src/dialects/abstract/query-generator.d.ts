// TODO: complete me - this file is a stub that will be completed when query-generator.ts is migrated to TS

import type { Col } from '../../expression-builders/col.js';
import type { Literal } from '../../expression-builders/literal.js';
import type {
  AttributeOptions,
  FindOptions,
  Model,
  ModelStatic,
  NormalizedAttributeOptions,
  SearchPathable,
} from '../../model.js';
import type { DataType } from './data-types.js';
import type { QueryGeneratorOptions, TableNameOrModel } from './query-generator-typescript.js';
import { AbstractQueryGeneratorTypeScript } from './query-generator-typescript.js';
import type { QueryWithBindParams } from './query-generator.types.js';
import type { TableName } from './query-interface.js';
import type { WhereOptions } from './where-sql-builder-types.js';

type ParameterOptions = {
  // only named replacements are allowed
  replacements?: { [key: string]: unknown },
};

type SelectOptions<M extends Model> = FindOptions<M> & {
  model: ModelStatic<M>,
};

type InsertOptions = ParameterOptions & SearchPathable & {
  exception?: boolean,
  bindParam?: false | ((value: unknown) => string),

  updateOnDuplicate?: string[],
  ignoreDuplicates?: boolean,
  upsertKeys?: string[],
  returning?: boolean | Array<string | Literal | Col>,
};

type BulkInsertOptions = ParameterOptions & {
  hasTrigger?: boolean,

  updateOnDuplicate?: string[],
  ignoreDuplicates?: boolean,
  upsertKeys?: string[],
  returning?: boolean | Array<string | Literal | Col>,
};

type UpdateOptions = ParameterOptions & {
  bindParam?: false | ((value: unknown) => string),
};

type DeleteOptions = ParameterOptions & {
  limit?: number | Literal | null | undefined,
};

type ArithmeticQueryOptions = ParameterOptions & {
  returning?: boolean | Array<string | Literal | Col>,
};

// keep CREATE_DATABASE_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface CreateDatabaseQueryOptions {
  collate?: string;
  charset?: string;
  encoding?: string;
  ctype?: string;
  template?: string;
}

// keep CREATE_SCHEMA_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface CreateSchemaQueryOptions {
  collate?: string;
  charset?: string;
}

export interface CreateTableQueryOptions {
  collate?: string;
  charset?: string;
  engine?: string;
  rowFormat?: string;
  comment?: string;
  initialAutoIncrement?: number;
  /**
   * Used for compound unique keys.
   */
  uniqueKeys?: Array<{ fields: string[] }>
   | { [indexName: string]: { fields: string[] } };
}

// keep DROP_TABLE_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface DropTableQueryOptions {
  cascade?: boolean;
}

// keep LIST_SCHEMAS_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface ListSchemasQueryOptions {
  /** List of schemas to exclude from output */
  skip?: string[];
}

// keep ADD_COLUMN_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface AddColumnQueryOptions {
  ifNotExists?: boolean;
}

// keep REMOVE_COLUMN_QUERY_SUPPORTABLE_OPTIONS updated when modifying this
export interface RemoveColumnQueryOptions {
  ifExists?: boolean;
}

/**
 * The base class for all query generators, used to generate all SQL queries.
 *
 * The implementation varies between SQL dialects, and is overridden by subclasses. You can access your dialect's version
 * through {@link Sequelize#queryGenerator}.
 */
export class AbstractQueryGenerator extends AbstractQueryGeneratorTypeScript {
  constructor(options: QueryGeneratorOptions);

  setImmediateQuery(constraints: string[]): string;
  setDeferredQuery(constraints: string[]): string;
  generateTransactionId(): string;
  quoteIdentifiers(identifiers: string): string;

  selectQuery<M extends Model>(tableName: TableName, options?: SelectOptions<M>, model?: ModelStatic<M>): string;
  insertQuery(
    table: TableName,
    valueHash: object,
    columnDefinitions?: { [columnName: string]: NormalizedAttributeOptions },
    options?: InsertOptions
  ): { query: string, bind?: unknown[] };
  bulkInsertQuery(
    tableName: TableName,
    newEntries: object[],
    options?: BulkInsertOptions,
    columnDefinitions?: { [columnName: string]: NormalizedAttributeOptions }
  ): string;

  addColumnQuery(
    table: TableName,
    columnName: string,
    columnDefinition: AttributeOptions | DataType,
    options?: AddColumnQueryOptions,
  ): string;

  removeColumnQuery(
    table: TableNameOrModel,
    attributeName: string,
    options?: RemoveColumnQueryOptions,
  ): string;

  updateQuery(
    tableName: TableName,
    attrValueHash: object,
    where: WhereOptions,
    options?: UpdateOptions,
    columnDefinitions?: { [columnName: string]: NormalizedAttributeOptions },
  ): { query: string, bind?: unknown[] };

  deleteQuery(
    tableName: TableName,
    where?: WhereOptions,
    options?: DeleteOptions,
    model?: ModelStatic<Model>,
  ): string;

  arithmeticQuery(
    operator: string,
    tableName: TableName,
    where: WhereOptions,
    incrementAmountsByField: { [key: string]: number | Literal },
    extraAttributesToBeUpdated: { [key: string]: unknown },
    options?: ArithmeticQueryOptions,
  ): string;

  createTableQuery(
    tableName: TableNameOrModel,
    // TODO: rename attributes to columns and accept a map of attributes in the implementation when migrating to TS, see https://github.com/sequelize/sequelize/pull/15526/files#r1143840411
    columns: { [columnName: string]: string },
    // TODO: throw when using invalid options when migrating to TS
    options?: CreateTableQueryOptions
  ): string;
  dropTableQuery(tableName: TableNameOrModel, options?: DropTableQueryOptions): string;
  renameTableQuery(before: TableNameOrModel, after: TableNameOrModel): string;

  createSchemaQuery(schemaName: string, options?: CreateSchemaQueryOptions): string;
  dropSchemaQuery(schemaName: string): string | QueryWithBindParams;

  listSchemasQuery(options?: ListSchemasQueryOptions): string;

  createDatabaseQuery(databaseName: string, options?: CreateDatabaseQueryOptions): string;
  dropDatabaseQuery(databaseName: string): string;
  listDatabasesQuery(): string;

  dropForeignKeyQuery(tableName: TableNameOrModel, foreignKey: string): string;

  removeConstraintQuery(tableName: TableNameOrModel, constraintName: string): string;

  versionQuery(): string;

  /**
   * Creates a function that can be used to collect bind parameters.
   *
   * @param bind A mutable object to which bind parameters will be added.
   */
  bindParam(bind: Record<string, unknown>): (newBind: unknown) => string;
}
