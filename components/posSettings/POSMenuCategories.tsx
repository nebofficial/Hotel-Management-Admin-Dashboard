"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string; sortOrder: number };

type Props = {
  value: Category[];
  onChange: (cats: Category[]) => void;
};

export function POSMenuCategories({ value, onChange }: Props) {
  const categories = Array.isArray(value) ? value : [];

  const update = (index: number, patch: Partial<Category>) => {
    const copy = categories.slice();
    copy[index] = { ...copy[index], ...patch };
    onChange(copy);
  };

  const add = () => {
    const id = `cat-${categories.length + 1}`;
    onChange([...categories, { id, name: "New Category", sortOrder: categories.length + 1 }]);
  };

  const remove = (index: number) => {
    onChange(categories.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
          Menu Category Settings
        </p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Organize menu categories for the POS.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        {categories.map((c, index) => (
          <div key={c.id} className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,0.7fr)_auto] gap-2 items-center">
            <div className="space-y-1">
              <Label className="text-[10px]">Category</Label>
              <Input
                className="h-8 text-[11px]"
                value={c.name}
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Order</Label>
              <Input
                type="number"
                className="h-8 text-[11px]"
                value={c.sortOrder}
                onChange={(e) =>
                  update(index, { sortOrder: Number(e.target.value || 0) })
                }
              />
            </div>
            <button
              type="button"
              className="mt-4 text-[11px] text-red-500 hover:text-red-600"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-[11px] text-amber-900 dark:text-amber-100 underline"
          onClick={add}
        >
          + Add category
        </button>
      </div>
    </Card>
  );
}

