import { visit } from 'unist-util-visit';
import React from "react";
import ReactDOM from "react-dom";
import {Button, Tooltip} from "@mui/material";
import {Launch} from "@mui/icons-material";

const createGoToRemark = (instanceId, callback) => {
    if (typeof instanceId === 'number' && instanceId < 0) {
        instanceId *= -1;
    }
    // remove any - from the instanceId if it's a string
    if (typeof instanceId === 'string') {
        instanceId = instanceId.replace(/-/g, '');
    }

    const plugin = () => {
        return (tree) => {
            visit(tree, 'link', (node) => {
                let title = node.children[0].value || "";
                // replace any - with : in the title
                title = title.replace(/-/g, ':');

                const url = node.url || "";
                const match = url.match(/^editor:\/\/(.+?)#(\d+)(?:-(\d+))?(\s.*)?$/);

                if (match) {
                    const filePath = match[1];
                    let startLine = parseInt(match[2], 10);
                    if (startLine > 0) {
                        startLine -= 1;
                    }
                    // Use a ternary operator to handle the optional end line
                    const endLine = match[3] ? parseInt(match[3], 10) : startLine + 1; // Use startLine if endLine is not specified

                    // Replace node with a placeholder for portal
                    node.type = 'html';
                    node.value = `<span id="gtc-${instanceId}-${title}-${filePath}-${startLine}-${endLine}"></span>`;
                }
            });
        };
    };

    const renderer = () => {
        if (typeof document === 'undefined') {
          return [];
        }

        let portals = [];
        document.querySelectorAll(`[id^="gtc-${instanceId}"]`).forEach((element) => {
            const id = element.id;
            const [_, instId, title, filePath, startLine, endLine] = id.split('-');

            const button = (
              <Tooltip title="Go To Code">
                  <Button
                    onClick={() => callback(filePath, parseInt(startLine, 10), parseInt(endLine, 10))}
                    variant={"text"}
                    sx={{
                        minWidth: 0,
                        fontSize: "0.8rem",
                        textTransform: "none",
                        fontWeight: "normal",
                        fontFamily: "monospace",
                        p: 0.3,
                    }}
                  >
                      {title}<Launch style={{fontSize: "12px", marginLeft: "3px"}}/>
                  </Button>
              </Tooltip>
            );

            // Using ReactDOM.createPortal to inject the button
            portals.push(ReactDOM.createPortal(button, element));
        });
        return portals;
    }

    return [plugin, renderer];
}

export default createGoToRemark;
