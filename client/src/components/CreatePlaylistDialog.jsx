import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader } from "lucide-react"
import { usePlaylistStore } from "@/store/usePlaylistStore"

export default function CreatePlaylistDialog({ 
  isOpen, 
  onOpenChange, 
  disabled = false,
  triggerButton = true,
  onPlaylistCreated // Add this new prop
}) {
  const { createPlaylist } = usePlaylistStore()
  
  // Internal state for when used as a standalone dialog (with trigger button)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Determine which open state to use
  const dialogIsOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setDialogOpen = onOpenChange || setInternalIsOpen

  const validateForm = () => {
    const errors = {}
    if (!newPlaylist.name?.trim()) {
      errors.name = "Playlist name is required"
    } else if (newPlaylist.name.trim().length < 3) {
      errors.name = "Playlist name must be at least 3 characters long"
    }
    if (newPlaylist.description?.length > 500) {
      errors.description = "Description must be less than 500 characters"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreatePlaylist = async () => {
    if (!validateForm()) return

    setIsCreating(true)
    try {
      await createPlaylist({
        name: newPlaylist.name.trim(),
        description: newPlaylist.description.trim(),
      })

      // Reset form state
      setNewPlaylist({ name: "", description: "" })
      setFormErrors({})
      
      // Close this dialog
      setDialogOpen(false)
      
      // Call the callback to notify parent (e.g., refresh playlists)
      if (onPlaylistCreated) {
        onPlaylistCreated()
      }
    } catch (error) {
      console.error("Failed to create playlist:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDialogClose = (open) => {
    if (!open && !isCreating) {
      // Reset form when closing
      setNewPlaylist({ name: "", description: "" })
      setFormErrors({})
    }
    setDialogOpen(open)
  }

  const handleInputChange = (field, value) => {
    setNewPlaylist({ ...newPlaylist, [field]: value })
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined })
    }
  }

  return (
    <Dialog open={dialogIsOpen} onOpenChange={handleDialogClose}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
            Create New Playlist
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>Create a custom playlist to organize your coding problems</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">
              Playlist Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="playlist-name"
              value={newPlaylist.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter playlist name"
              className={formErrors.name ? "border-red-500" : ""}
              disabled={isCreating}
            />
            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="playlist-description">Description</Label>
            <Textarea
              id="playlist-description"
              value={newPlaylist.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your playlist (optional)"
              rows={3}
              className={formErrors.description ? "border-red-500" : ""}
              disabled={isCreating}
              maxLength={500}
            />
            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            <p className="text-xs text-muted-foreground">{newPlaylist.description.length}/500 characters</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleDialogClose(false)} 
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlaylist} 
              disabled={isCreating || !newPlaylist.name.trim()}
            >
              {isCreating ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}