import { useState } from "react";
import useComponentStore from "../../../store/component";
import type { ComponentCategory } from "../../../types/component";
import { useFormValidator } from "../../../hooks/useFormValidator";
import { v4 as UUIDV4 } from "uuid";

export default function AddComponent({
  setShowAddComponent,
}: {
  setShowAddComponent: (show: boolean) => void;
}) {
  const initialComponent = {
    id: "",
    inUse: 0,
    name: "",
    category: "sensor" as ComponentCategory,
    quantity: 1,
    unitPrice: 0,
    supplier: "unknown",
    partNumber: "",
    description: "",
  };

  const [newComponent, setNewComponent] = useState(initialComponent);

  const { errors, validate, validateSingleField } = useFormValidator({
    name: { required: true, minLength: 2 },
    quantity: { required: true },
    unitPrice: { required: true },
  });

  const addComponent = useComponentStore((state) => state.addComponent);

  const handleBlur = (field: string, value: string | number) => {
    validateSingleField(field, String(value ?? ""));
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 bg-white/10 border ${
      errors[field] ? "border-red-500" : "border-white/20"
    } rounded-lg text-white placeholder-blue-200`;

  function handleSubmit() {
    const isValid = validate({
      name: newComponent.name,
      quantity: String(newComponent.quantity),
      unitPrice: String(newComponent.unitPrice),
    });

    if (isValid) {
      addComponent({ ...newComponent, id: UUIDV4() });
      setShowAddComponent(false);
      setNewComponent(initialComponent);
    }
  }

  function handleCancel() {
    setShowAddComponent(false);
    setNewComponent(initialComponent);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Add Component</h3>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Component Name"
              value={newComponent.name}
              onChange={(e) =>
                setNewComponent({ ...newComponent, name: e.target.value })
              }
              onBlur={(e) => handleBlur("name", e.target.value)}
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <select
            value={newComponent.category}
            onChange={(e) =>
              setNewComponent({
                ...newComponent,
                category: e.target.value as ComponentCategory,
              })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="sensor">Sensor</option>
            <option value="display">Display</option>
            <option value="microcontroller">Microcontroller</option>
            <option value="module">Module</option>
            <option value="actuator">Actuator</option>
            <option value="power_supply">Power Supply</option>
            <option value="passive">Passive</option>
            <option value="active">Active</option>
            <option value="other">Other</option>
          </select>

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="sr-only" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={newComponent.quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewComponent({
                    ...newComponent,
                    quantity:
                      value === ""
                        ? 0
                        : isNaN(Number(value))
                          ? newComponent.quantity
                          : parseInt(value, 10),
                  });
                }}
                onBlur={(e) => handleBlur("quantity", e.target.value)}
                className={inputClass("quantity")}
              />
              {errors.quantity && (
                <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="sr-only" htmlFor="unitPrice">
                Unit Price ($)
              </label>
              <input
                id="unitPrice"
                type="number"
                step="0.01"
                placeholder="Unit Price ($)"
                onChange={(e) => {
                  const value = e.target.value;
                  setNewComponent({
                    ...newComponent,
                    unitPrice:
                      value === ""
                        ? 0
                        : isNaN(Number(value))
                          ? newComponent.unitPrice
                          : parseFloat(value),
                  });
                }}
                onBlur={(e) => handleBlur("unitPrice", e.target.value)}
                className={inputClass("unitPrice")}
              />
              {errors.unitPrice && (
                <p className="text-red-400 text-sm mt-1">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {/* Supplier */}
          <input
            type="text"
            placeholder="Supplier"
            value={newComponent.supplier}
            onChange={(e) =>
              setNewComponent({ ...newComponent, supplier: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />

          {/* Part Number */}
          <input
            type="text"
            placeholder="Part Number"
            value={newComponent.partNumber}
            onChange={(e) =>
              setNewComponent({ ...newComponent, partNumber: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={newComponent.description}
            onChange={(e) =>
              setNewComponent({ ...newComponent, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Add Component
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
