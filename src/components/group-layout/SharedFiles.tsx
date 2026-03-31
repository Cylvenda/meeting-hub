const files = [
     { name: 'ProjectPlan.pdf', size: '1.2MB' },
     { name: 'Wireframes.png', size: '3.5MB' },
]

export default function SharedFiles() {
     return (
          <div className="bg-white p-4 rounded-2xl shadow">
               <h3 className="text-lg font-bold mb-4">Shared Files</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map(f => (
                         <div key={f.name} className="flex flex-col items-center p-3 border rounded-xl hover:bg-gray-50">
                              <div className="text-blue-600 text-2xl mb-2">📄</div>
                              <p className="text-sm font-medium">{f.name}</p>
                              <p className="text-xs text-gray-500">{f.size}</p>
                         </div>
                    ))}
               </div>
          </div>
     )
}