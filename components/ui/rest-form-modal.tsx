"use client";

import { observer } from "mobx-react";
import { DataObject, Filter } from "mobx-restful";
import { FC } from "react";
import { isEmpty } from "web-utility";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { RestForm, RestFormProps } from "./rest-form";

export const RestFormModal = observer(
  <D extends DataObject, F extends Filter<D> = Filter<D>>({
    fields,
    store,
    translator,
    ...props
  }: RestFormProps<D, F>) => {
    if (!store) return null;

    const { indexKey, currentOne } = store;

    const editing = !isEmpty(currentOne),
      ID = currentOne[indexKey];

    return (
      <Dialog open={editing} onOpenChange={() => store.clearCurrent()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ID}</DialogTitle>
          </DialogHeader>

          <RestForm id={ID} {...{ fields, store, translator, ...props }} />
        </DialogContent>
      </Dialog>
    );
  },
);
(RestFormModal as FC).displayName = "RestFormModal";
