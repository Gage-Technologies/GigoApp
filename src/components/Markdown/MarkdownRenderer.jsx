import React, { useCallback, useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { defaultSchema } from 'rehype-sanitize';
import remarkCodeBlock from 'remark-code-blocks';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { darkSyntaxTheme } from './SyntaxHighlights';
import merge from 'deepmerge';
import { visit } from 'unist-util-visit';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import getStyles from './styles';
// import { render, screen } from '@testing-library/react-native';

const syntaxHighlightingSchema = merge(defaultSchema, {
  attributes: {
    code: [...(defaultSchema.attributes.code || []), 'class'],
  },
});

const MarkdownRenderer = ({
  markdown,
  style,
  onAllMediaLoaded,
  imgProxy,
  remarkPlugins,
  rehypePlugins,
  goToCallback,
  textColor
}) => {
  const theme = useTheme();
  const styles = getStyles(theme, textColor);

  const [copied, setCopied] = useState(null);
  const [mediaCount, setMediaCount] = useState(0);
  const [loadedMediaCount, setLoadedMediaCount] = useState(0);

  const [portals, setPortals] = useState([])

  // state to store the page width
  const [pageWidth, setPageWidth] = useState(0);

  // function to update the page width
  const updatePageWidth = useCallback(() => {
    // get the window width using dimensions api
    const { width } = Dimensions.get('window');
    setPageWidth(width);
  }, []);

  // effect to set initial page width and add event listener
  useEffect(() => {
    updatePageWidth();
    // add event listener for dimension changes
    Dimensions.addEventListener('change', updatePageWidth);
    // cleanup function to remove event listener
    return () => {
      try {
        Dimensions.removeEventListener('change', updatePageWidth);
      } catch (e) {
        console.log(e);
      }
    };
  }, [updatePageWidth]);

  useEffect(() => {
    if (mediaCount === loadedMediaCount && mediaCount > 0) {
      onAllMediaLoaded(); // this function can be used to measure height
    }
  }, [mediaCount, loadedMediaCount, onAllMediaLoaded]);

  useEffect(() => {
    // reset counters when new markdown is received
    setLoadedMediaCount(0);
    // use regex to count number of images in markdown and html
    const markdownImageRegex = /!\[[^\]]*\]\([^)]+\)/g;
    const htmlImageRegex = /<img [^>]*src="[^"]*"[^>]*>/g;
    // use regex to count number of videos in markdown and html
    const htmlVideoRegex = /<video [^>]*src="[^"]*"[^>]*>/g;

    const markdownMatches = markdown.match(markdownImageRegex) || [];
    const htmlMatches = markdown.match(htmlImageRegex) || [];
    const htmlVideoMatches = markdown.match(htmlVideoRegex) || [];

    setMediaCount(markdownMatches.length + htmlMatches.length + htmlVideoMatches.length);
  }, [markdown]);

  const handleMediaLoad = useCallback((x) => {
    setLoadedMediaCount(prevCount => prevCount + 1);
  }, []);

  useEffect(() => {
    let p = [];
    for (let i = 0; i < remarkPlugins.length; i++) {
      let rp = remarkPlugins[i][1]();
      p = p.concat(rp)
    }
    for (let i = 0; i < rehypePlugins.length; i++) {
      let rp = rehypePlugins[i][1]();
      p = p.concat(rp)
    }
    setPortals(p);
  }, [markdown, remarkPlugins, rehypePlugins]);

  function rehypeOnLoadPlugin() {
    return (tree) => {
      visit(tree, 'element', (node) => {
        if (node.tagName === 'img') {
          node.properties.id = "img:" + node.properties.src;
          node.properties.onLoad = () => {
            handleMediaLoad({ target: node })
          };
          node.properties.loading = "lazy";
          if (config.imgCdnProxy && imgProxy) {
            node.properties.src = config.imgCdnProxy + imgProxy + node.properties.src;
          }
        }

        if (node.tagName === 'video') {
          // retrieve the first source in the children if it exists
          let src;
          if (node.children.length > 0) {
            src = node.children[0].properties.src;
          } else {
            src = node.properties.src;
          }
          node.properties.id = "video:" + src;

          node.properties.onLoadedData = () => {
            handleMediaLoad({ target: node })
          };
          node.properties.loading = "lazy";
          node.properties.controls = false;
          node.properties.muted = true;
          node.properties.playsInline = true;
          node.properties.autoPlay = true;
          node.properties.loop = true;
        }
      });
    };
  }

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    setCopied(text);
  };

  const renderText = (props) => {
    return <Text {...props} style={[styles.text, props.style]}>{props.children}</Text>;
  };

  const renderParagraph = (props) => {
    return <Text {...props} style={[styles.paragraph, props.style]}>{props.children}</Text>;
  };

  const renderHeading = (props) => {
    const style = styles[`h${props.level}`] || styles.h1;
    return <Text {...props} style={[style, props.style]}>{props.children}</Text>;
  };

  const renderList = (props) => {
    return <View {...props} style={[styles.list, props.style]}>{props.children}</View>;
  };

  const renderListItem = (props) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemBullet}>•</Text>
        <Text {...props} style={[styles.listItemText, props.style]}>{props.children}</Text>
      </View>
    );
  };

  const renderLink = (props) => {
    return (
      <Text
        {...props}
        style={[styles.link, props.style]}
        onPress={() => goToCallback && goToCallback(props.href)}
      >
        {props.children}
      </Text>
    );
  };

  // function to convert html text elements to react native compatible elements
  function rehypeTextToReactNative() {
    return (tree) => {
      visit(tree, (node, index, parent) => {
        // // handle any node that has a value property
        // if (node.value !== undefined && node.value.trim() === "") {
        //   // remove nodes with empty value
        //   node.type = undefined
        //   node.value = undefined
        //   return
        // }

        if (node.type === 'text' && parent.tagName !== 'RCTText') {
          // wrap non-empty text nodes in Text components
          node.type = 'element';
          node.tagName = 'RCTText';
          node.properties = { style: styles.text };
          node.children = [{ type: 'text', value: node.value }];
        }

        // if (node.type === 'element' && node.tagName === 'code') {
        //   // add maxWidth to the style of code elements
        //   node.properties = {
        //     ...(node.properties || {}),
        //     style: {
        //       ...(node.properties?.style || {}),
        //       maxWidth: '100%',
        //       backgroundColor: 'transparent'
        //     },
        //   };
        // }
      });
    };
  }

  const md = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkCodeBlock, ...remarkPlugins.map(x => x[0])]}
      rehypePlugins={[rehypeRaw, rehypeTextToReactNative, rehypeOnLoadPlugin, { settings: syntaxHighlightingSchema }, ...rehypePlugins.map(x => x[0])]}
      components={{
        text: renderText,
        span: renderText,
        strong: renderText,
        blockquote: renderText,
        em: renderText,
        pre: renderText,
        p: renderParagraph,
        h1: renderHeading,
        h2: renderHeading,
        h3: renderHeading,
        h4: renderHeading,
        h5: renderHeading,
        h6: renderHeading,
        ul: renderList,
        ol: renderList,
        li: renderListItem,
        a: renderLink,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          let t = "";
          if (children === undefined || children.length === 0 || children[0] === undefined) {
            return null;
          }
          if (children[0].type === "RCTText") {
            t = String(children[0].props.children[0]).trim();
          } else {
            t = String(children[0]).trim();
          }

          // return styled code
          if (!inline && match) {
            const goToLinkMatch = t.trim().match(/^\[[^\]]+\]\(editor:\/\/(.+?)#(\d+)(?:-(\d+))?\)/);
            let goToLink = null;
            if (goToLinkMatch) {
              // regardless of whether the user has a goToCallback, we still want to remove the link from the text
              t = t.replace(goToLinkMatch[0], "").trim();

              if (goToCallback) {
                const filePath = goToLinkMatch[1];
                let startLine = parseInt(goToLinkMatch[2], 10);
                if (startLine > 0) {
                  startLine -= 1;
                }
                // use a ternary operator to handle the optional end line
                const endLine = goToLinkMatch[3] ? parseInt(goToLinkMatch[3], 10) : startLine + 1; // use startLine if endLine is not specified

                goToLink = (
                  <TouchableOpacity
                    onPress={() => goToCallback(filePath, parseInt(startLine, 10), parseInt(endLine, 10))}
                    style={styles.iconButton}
                  >
                    <Icon name="launch" size={12} color={theme.colors.secondary} />
                  </TouchableOpacity>
                );
              }
            }

            // Note we do some hacky stuff here to get the markdown renderer to fit the screen
            // this is because we have to figure out why the code node does not respoect styling here
            // and changes in the rehype plugin cause a crash with the syntax highlighter so for now
            // the markdown renderer can only be used on full page presentation (common so not a big issue)
            return (
              <View style={[styles.codeBlock, { maxWidth: pageWidth - 49 }]}>
                <Text style={styles.languageLabel}>
                  {match[1] !== "" && match[1] !== "_" ? match[1] : "plaintext"}
                </Text>
                <View style={styles.codeActions}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(t)}
                    style={styles.iconButton}
                  >
                    <Icon
                      name={copied === t ? "check" : "content-copy"}
                      size={14}
                      color={copied === t ? theme.colors.success : theme.colors.primary}
                    />
                  </TouchableOpacity>
                  {goToLink}
                </View>
                <SyntaxHighlighter
                  style={darkSyntaxTheme}
                  language={match[1]}
                  highlighter="prism"
                  PreTag={View}
                  {...props}
                >
                  {t}
                </SyntaxHighlighter>
              </View>
            );
          }

          // return inline code
          return (
            <TouchableOpacity onPress={() => copyToClipboard(t)}>
              <Text style={styles.inlineCode} {...props}>
                {children}
              </Text>
            </TouchableOpacity>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )

  if (markdown === undefined || markdown === null || markdown === '') {
    return null;
  }

  // render(md);
  // console.log(JSON.stringify(screen.toJSON()));

  return (
    <>
      <View style={[styles.markdownBody, style]}>
        {md}
      </View>
      {portals}
    </>
  );
};

MarkdownRenderer.defaultProps = {
  style: {},
  onAllMediaLoaded: () => { },
  imgProxy: null,
  remarkPlugins: [],
  rehypePlugins: [],
  goToCallback: null,
};

export default MarkdownRenderer;
