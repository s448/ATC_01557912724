
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Mock categories data
const initialCategories = [
  { id: '1', name: 'Concert', eventsCount: 12 },
  { id: '2', name: 'Conference', eventsCount: 8 },
  { id: '3', name: 'Workshop', eventsCount: 5 },
  { id: '4', name: 'Exhibition', eventsCount: 7 },
  { id: '5', name: 'Sport Event', eventsCount: 10 },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '' });
  const [isNewCategory, setIsNewCategory] = useState(true);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (category?: typeof initialCategories[0]) => {
    if (category) {
      setCurrentCategory({ id: category.id, name: category.name });
      setIsNewCategory(false);
    } else {
      setCurrentCategory({ id: '', name: '' });
      setIsNewCategory(true);
    }
    setIsDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (currentCategory.name.trim() === '') return;

    if (isNewCategory) {
      // Add new category
      const newId = (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString();
      setCategories([...categories, { id: newId, name: currentCategory.name, eventsCount: 0 }]);
    } else {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === currentCategory.id ? { ...category, name: currentCategory.name } : category
      ));
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Category Management</CardTitle>
          <Button size="sm" onClick={() => handleOpenDialog()}>Add Category</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.eventsCount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewCategory ? 'Add New Category' : 'Edit Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManagement;
