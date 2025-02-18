import { Edit, Trash2 } from "lucide-react";

function ItemCard({ item, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600">{item.category}</p>
        <div className="mt-2 flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              item.status === "In Stock"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.status}
          </span>
          <span className="text-gray-600">Qty: {item.quantity}</span>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
