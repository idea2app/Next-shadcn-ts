"use client";

import debounce from "lodash.debounce";
import { computed, observable } from "mobx";
import { TranslationModel } from "mobx-i18n";
import { observer } from "mobx-react";
import { ObservedComponent } from "mobx-react-helper";
import { DataObject, Filter, IDType } from "mobx-restful";
import { HTMLAttributes, ReactNode } from "react";
import { isEmpty } from "web-utility";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BadgeBar } from "./badge-bar";
import { FilePreview } from "./file-preview";
import { Pager } from "./pager";
import { Field, RestForm, RestFormProps } from "./rest-form";
import { RestFormModal } from "./rest-form-modal";
import { Spinner } from "./spinner";

export interface Column<T extends DataObject>
  extends Omit<Field<T>, "renderLabel"> {
  renderHead?: Field<T>["renderLabel"];
  renderBody?: (data: T) => ReactNode;
  renderFoot?: ReactNode | ((data: keyof T) => ReactNode);
}

type Translator<T extends DataObject> = RestFormProps<T>["translator"] &
  TranslationModel<
    string,
    "create" | "view" | "edit" | "delete" | "total_x_rows" | "sure_to_delete_x"
  >;

export interface RestTableProps<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit" | "onReset">,
    Pick<RestFormProps<D>, "size" | "store" | "onSubmit" | "onReset"> {
  filter?: F;
  filterFields?: Field<F>[];
  editable?: boolean;
  deletable?: boolean;
  columns: Column<D>[];
  translator: Translator<D>;
  onCheck?: (keys: IDType[]) => any;
}

@observer
export class RestTable<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends ObservedComponent<RestTableProps<D, F>> {
  static readonly displayName = "RestTable";

  componentDidMount() {
    const { store, filter } = this.props;

    store?.clear();
    store?.getList(filter);
  }

  @computed
  get fieldSize() {
    const { size } = this.observedProps;

    return !size || size === "default" ? "default" : size;
  }

  @observable
  checkedKeys: IDType[] = [];

  toggleCheck(key: IDType) {
    const { checkedKeys } = this;
    const index = checkedKeys.indexOf(key);

    this.checkedKeys =
      index < 0
        ? [...checkedKeys, key]
        : [...checkedKeys.slice(0, index), ...checkedKeys.slice(index + 1)];

    this.props.onCheck?.(this.checkedKeys);
  }

  toggleCheckAll = () => {
    const { store, onCheck } = this.props;

    if (!store) return;

    const { indexKey, currentPage } = store;

    this.checkedKeys = this.checkedKeys.length
      ? []
      : currentPage.map(({ [indexKey]: ID }) => ID);

    onCheck?.(this.checkedKeys);
  };

  @computed
  get checkColumn(): Column<D> {
    const { checkedKeys, toggleCheckAll } = this;
    const { store } = this.observedProps;

    if (!store) return {} as Column<D>;

    const { indexKey, currentPage } = store;

    return {
      renderHead: () => (
        <Checkbox
          checked={
            !!currentPage[0] &&
            currentPage.every(({ [indexKey]: ID }) => checkedKeys.includes(ID))
          }
          aria-label="Select all"
          onCheckedChange={toggleCheckAll}
        />
      ),
      renderBody: ({ [indexKey]: ID }) => (
        <Checkbox
          checked={checkedKeys.includes(ID)}
          aria-label={`Select row ${ID}`}
          onCheckedChange={() => this.toggleCheck(ID)}
        />
      ),
    };
  }

  @computed
  get operateColumn(): Column<D> {
    const { editable, deletable, columns, store, translator } =
      this.observedProps;

    if (!store) return {} as Column<D>;

    const { fieldSize } = this,
      { t } = translator,
      readOnly = columns.every(({ readOnly }) => readOnly),
      disabled = columns.every(({ disabled }) => disabled);

    return {
      renderHead: () => <></>,
      renderBody: (data) => (
        <div className="flex gap-1">
          {!disabled && editable && (
            <Button
              variant={readOnly ? "default" : "outline"}
              size={fieldSize}
              onClick={() => (store.currentOne = data)}
            >
              {readOnly ? t("view") : t("edit")}
            </Button>
          )}
          {deletable && (
            <Button
              variant="destructive"
              size={fieldSize}
              onClick={() => this.deleteList([data[store.indexKey]])}
            >
              {t("delete")}
            </Button>
          )}
        </div>
      ),
    };
  }

  @computed
  get columns() {
    const { editable, deletable, columns, onCheck } = this.observedProps;

    return [
      onCheck && this.checkColumn,
      ...columns.map(
        ({ renderBody, ...column }) =>
          ({
            ...column,
            renderBody: renderBody ?? this.renderCustomBody(column),
          }) as Column<D>,
      ),
      (editable || deletable) && this.operateColumn,
    ].filter(Boolean) as Column<D>[];
  }

  @computed
  get hasHeader() {
    return this.columns.some(({ renderHead }) => renderHead);
  }

  @computed
  get hasFooter() {
    return this.columns.some(({ renderFoot }) => renderFoot);
  }

  @computed
  get editing() {
    return !isEmpty(this.observedProps.store?.currentOne);
  }

  renderCustomBody = ({
    key,
    type,
    multiple,
    options,
    accept,
    rows,
  }: Column<D>): Column<D>["renderBody"] =>
    type === "url"
      ? ({ [key!]: value }) =>
          value && (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              href={value as string}
            >
              {value as string}
            </a>
          )
      : type === "email"
        ? ({ [key!]: value }) =>
            value && (
              <a
                className="text-primary hover:underline"
                href={`mailto:${value}`}
              >
                {value as string}
              </a>
            )
        : type === "tel"
          ? ({ [key!]: value }) =>
              value && (
                <a
                  className="text-primary hover:underline"
                  href={`tel:${value}`}
                >
                  {value as string}
                </a>
              )
          : type === "file"
            ? ({ [key!]: value }) =>
                ((Array.isArray(value) ? value : [value]) as string[]).map(
                  (path) =>
                    path && (
                      <FilePreview key={path} type={accept} path={path} />
                    ),
                )
            : options || multiple
              ? ({ [key!]: value }) =>
                  value && (
                    <BadgeBar
                      list={(value as string[]).map((text) => ({ text }))}
                    />
                  )
              : !options && rows
                ? ({ [key!]: value }) => (
                    <p
                      className="m-0 truncate max-w-xs"
                      title={value as string}
                    >
                      {value as string}
                    </p>
                  )
                : undefined;

  renderTable() {
    const { store } = this.props;

    if (!store) return null;

    const { hasHeader, hasFooter, columns, editing } = this;
    const { indexKey, downloading, currentPage } = store;

    return (
      <Table>
        {hasHeader && (
          <TableHeader>
            <TableRow>
              {columns.map(
                ({ key, renderHead }, index) =>
                  (key || renderHead) && (
                    <TableHead key={key?.toString() || index}>
                      {typeof renderHead === "function"
                        ? renderHead(key!)
                        : renderHead || (key as string)}
                    </TableHead>
                  ),
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {!editing && downloading > 0 ? (
            <TableRow>
              <TableCell className="text-center p-3" colSpan={columns.length}>
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            currentPage.map((data) => (
              <TableRow key={data[indexKey] as string}>
                {columns.map(
                  ({ key, renderBody }, index) =>
                    (key || renderBody) && (
                      <TableCell key={key?.toString() || index}>
                        {renderBody?.(data) || (key && data[key])}
                      </TableCell>
                    ),
                )}
              </TableRow>
            ))
          )}
        </TableBody>

        {hasFooter && (
          <TableFooter>
            <TableRow>
              {columns.map(
                ({ key, renderFoot }, index) =>
                  (key || renderFoot) && (
                    <TableCell key={key?.toString() || index}>
                      {typeof renderFoot === "function"
                        ? renderFoot(key!)
                        : renderFoot || (key as string)}
                    </TableCell>
                  ),
              )}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    );
  }

  getList = debounce(({ pageIndex, pageSize }) => {
    const { store, filter } = this.props;

    if (store && store.downloading < 1)
      store.getList(filter, pageIndex, pageSize);
  });

  async deleteList(keys: IDType[]) {
    const { translator, store } = this.props;

    if (confirm(translator.t("sure_to_delete_x", { keys })))
      for (const key of keys) await store?.deleteOne(key);
  }

  render() {
    const {
      className = "overflow-auto flex flex-col gap-3",
      editable,
      deletable,
      filterFields,
      store,
      translator,
      onSubmit,
      onReset,
      ...props
    } = this.props;

    if (!store) return null;

    const { fieldSize } = this;
    const { t } = translator;
    const { indexKey, pageSize, pageIndex, pageCount, totalCount } = store;

    return (
      <div className={className} {...props}>
        <header className="sticky top-0 z-1 bg-background/80 backdrop-blur py-3 flex flex-wrap gap-3 justify-between items-center border-b">
          {filterFields && (
            <RestForm
              className="flex flex-wrap items-center gap-3 pb-3 m-0 border-b"
              size={fieldSize}
              translator={translator}
              fields={filterFields}
              onSubmit={(filter) => store.getList(filter, 1)}
              onReset={() => store.getList({}, 1)}
            />
          )}
          {deletable && (
            <Button
              variant="destructive"
              size={fieldSize}
              disabled={!this.checkedKeys[0]}
              onClick={() => this.deleteList(this.checkedKeys)}
            >
              {t("delete")}
            </Button>
          )}
          {editable && (
            <Button
              size={fieldSize}
              onClick={() => (store.currentOne[indexKey] = "" as D[keyof D])}
            >
              {t("create")}
            </Button>
          )}
        </header>

        {this.renderTable()}

        <footer className="flex justify-between items-center py-3 border-t">
          {!!totalCount && (
            <span className="mx-3 text-sm text-muted-foreground">
              {t("total_x_rows", { totalCount })}
            </span>
          )}
          <Pager
            {...{ pageSize, pageIndex, pageCount }}
            onChange={this.getList}
          />
        </footer>

        {editable && (
          <RestFormModal
            size={fieldSize}
            fields={this.columns.map(({ renderHead, ...field }) => ({
              ...field,
              renderLabel: renderHead,
            }))}
            {...{ store, translator, onSubmit }}
          />
        )}
      </div>
    );
  }
}
