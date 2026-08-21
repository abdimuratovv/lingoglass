import { Search } from 'lucide-react';

export function AdminUserManagement() {
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', level: 'B1', joined: '2023-10-15', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com', level: 'C1', joined: '2023-09-02', status: 'Active' },
    {
      id: 3,
      name: 'Miguel Santos',
      email: 'msantos@example.com',
      level: 'A2',
      joined: '2023-11-20',
      status: 'Inactive',
    },
    { id: 4, name: 'Emma Wilson', email: 'emma.w@example.com', level: 'B2', joined: '2023-10-05', status: 'Active' },
    { id: 5, name: 'David Chen', email: 'dchen@example.com', level: 'B1', joined: '2023-12-01', status: 'Active' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">User Management</h3>
          <p className="text-sm text-navy/70">View and manage registered learners.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50" size={16} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-amaranth/50 text-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-navy/70">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Level</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 overflow-hidden shrink-0">
                        <img
                          src={`https://picsum.photos/seed/${user.name.split(' ')[0].toLowerCase()}/100/100`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-navy/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-xs font-bold">
                      {user.level}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-navy/80">{user.joined}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-medium text-amaranth hover:text-amaranth/80 transition-colors px-2">
                      Edit
                    </button>
                    <button className="text-sm font-medium text-navy/60 hover:text-charcoal transition-colors px-2">
                      View Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-auto p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          <span className="text-sm text-navy/60">Showing 1 to 5 of 1,240 users</span>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm disabled:opacity-50"
              disabled
            >
              Prev
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm font-medium">1</button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm hover:bg-white/10">
              2
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm hover:bg-white/10">
              3
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm hover:bg-white/10">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
