"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Table = { id: string; name: string; capacity: number; zone: string };

type Layout = {
  tables: Table[];
};

type Props = {
  value: Layout;
  onChange: (layout: Layout) => void;
};

export function POSTableManagement({ value, onChange }: Props) {
  const tables = Array.isArray(value.tables) ? value.tables : [];

  const updateTable = (index: number, patch: Partial<Table>) => {
    const copied = tables.slice();
    copied[index] = { ...copied[index], ...patch };
    onChange({ tables: copied });
  };

  const addTable = () => {
    const id = `T${tables.length + 1}`;
    onChange({
      tables: [...tables, { id, name: id, capacity: 4, zone: "Indoor" }],
    });
  };

  const removeTable = (index: number) => {
    onChange({ tables: tables.filter((_, i) => i !== index) });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Table Management Setup
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Configure table layout, capacity, and zones.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        {tables.map((t, index) => (
          <div
            key={t.id}
            className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto] gap-2 items-center mb-1"
          >
            <div className="space-y-1">
              <Label className="text-[10px]">Table</Label>
              <Input
                className="h-8 text-[11px]"
                value={t.name}
                onChange={(e) => updateTable(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Capacity</Label>
              <Input
                type="number"
                className="h-8 text-[11px]"
                value={t.capacity}
                onChange={(e) =>
                  updateTable(index, { capacity: Number(e.target.value || 0) })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Zone</Label>
              <select
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-0.5 text-[11px] shadow-sm"
                value={t.zone}
                onChange={(e) => updateTable(index, { zone: e.target.value })}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <button
              type="button"
              className="mt-4 text-[11px] text-red-500 hover:text-red-600"
              onClick={() => removeTable(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-[11px] text-violet-900 dark:text-violet-100 underline"
          onClick={addTable}
        >
          + Add table
        </button>
      </div>
    </Card>
  );
}

