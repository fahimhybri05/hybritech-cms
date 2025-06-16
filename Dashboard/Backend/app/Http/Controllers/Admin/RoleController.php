<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return Role::with('permissions')->get();
    }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'name' => 'required|string|unique:roles,name',
        //     'permissions' => 'nullable|array'
        // ]);

        $role = Role::create(['name' => $request->input('name')]);

        if (!empty($request->input('permissions'))) {
            $role->syncPermissions($request->input('permissions'));
        }

        return response()->json($role->load('permissions'), 201);
    }

    // public function show(string $id)
    // {
    //     return Role::with('permissions')->findOrFail($id);
    // }

    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array'
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json($role->load('permissions'));
    }

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }
    // RoleController.php
    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role);
    }
    public function getRolePermissions($roleId)
    {
        $role = Role::findById($roleId);
        return response()->json($role->permissions);
    }
    // public function assignPermissions(Request $request, $id)
    // {
    //     $role = Role::findById($id);
    //     $permissionIds = $request->input('permissions', []);
    //     $role->syncPermissions($permissionIds);

    //     return response()->json(['message' => 'Permissions assigned successfully']);
    // }
    // RoleController.php
    public function getPermissions(Role $role)
    {
        return response()->json($role->permissions);
    }

    public function assignPermissions(Request $request, Role $role)
    {
        $role->syncPermissions($request->permissions); // expects array of IDs
        return response()->json(['message' => 'Permissions updated']);
    }

}
