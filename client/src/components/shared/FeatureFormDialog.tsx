import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

interface FeatureFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string, link?: string) => void;
}

/**
 * Dialog for creating a new feature
 */
export function FeatureFormDialog({ open, onClose, onSubmit }: FeatureFormDialogProps) {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim(), link.trim() || undefined);
            setName("");
            setLink("");
            onClose();
        }
    };

    const handleClose = () => {
        setName("");
        setLink("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Start New Feature</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Feature Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Link (optional)"
                    fullWidth
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim()}
                >
                    Start Feature
                </Button>
            </DialogActions>
        </Dialog>
    );
}
