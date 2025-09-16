import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Link as MLink,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import OpenInNew from "@mui/icons-material/OpenInNew";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import PropTypes from "prop-types";
import { iconForMime } from "../../utils/gastoUtils";

export default function GastoAdjuntos({
  adjuntos,
  baseUploads = "/uploads/",
  onDelete,
  removing,
}) {
  const theme = useTheme();

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader title="Adjuntos" />
      <Divider />
      <CardContent sx={{ pt: 0 }}>
        {adjuntos?.length ? (
          <List dense disablePadding>
            {adjuntos.map((a) => {
              const MimeIcon = iconForMime(a.mimetype);
              const url = `${baseUploads}${encodeURI(a.path_rel)}`;

              return (
                <ListItem
                  key={a.id_adjunto}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Abrir en nueva pestaña">
                        <IconButton
                          edge="end"
                          component={MLink}
                          href={url}
                          target="_blank"
                          rel="noopener"
                          underline="hover"
                        >
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar adjunto">
                        <span>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={(e) => onDelete(a, e)}
                            disabled={removing}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  }
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded">
                      {" "}
                      <MimeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <MLink
                        href={`${baseUploads}${a.path_rel}`}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                      >
                        {a.original_name || a.filename}
                      </MLink>
                    }
                    secondary={`${((a.size || 0) / 1024) >> 0} KB`}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No hay archivos adjuntos.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

GastoAdjuntos.propTypes = {
  adjuntos: PropTypes.array,
  baseUploads: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  removing: PropTypes.bool,
};
