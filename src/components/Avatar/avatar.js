import React, {useState, useRef, useEffect} from 'react';
import {Piece} from 'avataaars';
import Avatar from './avatarIndex.tsx';
import map from 'lodash/map';
import options from './options';
import styles from './style';
import {DownloadIcon} from './svg';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Canvas from 'react-native-canvas';

const Avataaar = props => {
  const canvasRef = useRef(null);
  const avatarRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('top');
  const [visibleIndices, setVisibleIndices] = useState({});
  const [avatarAttributes, setAvatarAttributes] = useState(props.value);

  const pieceClicked = (attr, val) => {
    var newAttributes = {
      ...props.value,
      [attr]: val,
      avatarRef,
    };
    if (props.onChange) {
      props.onChange(newAttributes);
    }
  };

  const randomizeAvatar = () => {
    let newAttributes = {};

    map(options, option => {
      const randomValue =
        option.values[Math.floor(Math.random() * option.values.length)];
      newAttributes[option.attribute] = randomValue;
    });
    newAttributes.avatarRef = avatarRef;

    setAvatarAttributes(newAttributes);
    if (props.onChange) {
      props.onChange(newAttributes);
    }
  };

  //  const triggerDownload = (imageBlob, fileName) => {
  //    FileSaver.saveAs(imageBlob, fileName);
  //  };

  //  let userPref = localStorage.getItem('theme')

  //  const onDownloadSVG = () => {
  //    const svgNode = ReactDOM.findDOMNode(avatarRef.current);
  //    const data = svgNode.outerHTML;
  //    const svg = new Blob([data], { type: "image/svg+xml" });
  //    triggerDownload(svg, "avatar.svg");
  //  };
  const scrollPieces = (type, direction) => {
    setVisibleIndices(prevIndices => {
      const startIndex = prevIndices[type]?.startIndex || 0;
      const endIndex = prevIndices[type]?.endIndex || 3;
      if (direction === 'next') {
        return {
          ...prevIndices,
          [type]: {startIndex: startIndex + 1, endIndex: endIndex + 1},
        };
      } else {
        return {
          ...prevIndices,
          [type]: {
            startIndex: Math.max(0, startIndex - 1),
            endIndex: Math.max(3, endIndex - 1),
          },
        };
      }
    });
  };

  useEffect(() => {
    //@ts-ignore
    if (props.creation !== undefined && props.creation) {
      randomizeAvatar();
    }
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={randomizeAvatar}>
        <Icon name="shuffle" size={30} color="#000" />
      </TouchableOpacity>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          width: '90%',
          justifyContent: 'center',
        }}>
        <View
          style={
            window.innerWidth > 1000 ? {} : {width: 'auto', marginRight: '50px'}
          }>
          <Avatar
            ref={avatarRef}
            style={
              window.innerWidth > 1000
                ? {
                    width: '200px',
                    height: '200px',
                    position: 'relative',
                    top: '35px',
                  }
                : {
                    width: '150px',
                    height: '150px',
                    position: 'relative',
                    top: '35px',
                  }
            }
            {...props.value}
          />
        </View>
        <View>
          {options.map(option => (
            <TouchableOpacity
              onPress={() => setSelectedTab(option.type)}
              key={option.type}>
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {props.creation === undefined && (
        <Tabpanes
          style={
            window.innerWidth > 1000
              ? {position: 'relative', top: '15px'}
              : {
                  display: 'flex',
                  width: '85%',
                  justifyContent: 'center',
                  top: '15px',
                }
          }>
          {options.map(option => {
            const {type} = option;
            const startIndex = visibleIndices[type]?.startIndex || 0;
            const endIndex = visibleIndices[type]?.endIndex || 3;
            const canScrollLeft = startIndex > 0;
            const canScrollRight = endIndex < option.values.length;

            return (
              <Tabpane selectedTab={selectedTab} type={option.type}>
                {option.type !== 'avatarStyle' &&
                option.type !== 'skin' &&
                option.type !== 'skinColor' ? (
                  <TouchableOpacity
                    onPress={() => scrollPieces(type, 'prev')}
                    disabled={!canScrollLeft}
                    style={[
                      styles.button,
                      {opacity: canScrollLeft ? 1 : 0.3}, // Adjust opacity based on whether the button is disabled
                    ]}>
                    <Icon name="arrow-back-ios" size={24} color={'white'} />
                  </TouchableOpacity>
                ) : null}

                {option.values.slice(startIndex, endIndex).map(val => {
                  var attr = {};
                  attr[option.attribute] = val;
                  if (option.transform) {
                    attr.style = {transform: option.transform};
                  }

                  return (
                    <Pieces onClick={() => pieceClicked(option.attribute, val)}>
                      {option.type === 'avatarStyle' ? (
                        <span style={{margin: '5px'}}>{val}</span>
                      ) : (
                        <Piece
                          pieceSize="50"
                          pieceType={option.type}
                          {...attr}
                        />
                      )}

                      {(val === 'Blank' || val === 'NoHair') && (
                        <None>(none)</None>
                      )}
                    </Pieces>
                  );
                })}
                {option.type !== 'avatarStyle' &&
                option.type !== 'skin' &&
                option.type !== 'skinColor' ? (
                  <TouchableOpacity
                    onPress={() => scrollPieces(type, 'next')}
                    disabled={!canScrollRight}
                    style={[
                      styles.button,
                      {opacity: canScrollRight ? 1 : 0.3}, // Adjust opacity based on whether the button is disabled
                    ]}>
                    <Icon name="arrow-forward-ios" size={24} color={'white'} />
                  </TouchableOpacity>
                ) : null}
                {/*{this is the color selector for things like shirt or skin tone, that's why its only for a few'}*/}
                <ColorContainer>
                  {option.colors &&
                    (option.type !== 'top' ||
                      option.hats.indexOf(props.value.topType) === -1) &&
                    map(option.colors, (color, colorName) => {
                      return (
                        <Color
                          style={{
                            backgroundColor: color,
                            border:
                              color === '#FFFFFF'
                                ? '1px solid #ccc'
                                : '1px solid ' + color,
                          }}
                          onClick={() =>
                            pieceClicked(option.colorAttribute, colorName)
                          }
                        />
                      );
                    })}

                  {option.hatColors &&
                    option.hats.indexOf(props.value.topType) !== -1 &&
                    props.value.topType !== 'Hat' &&
                    map(option.hatColors, (color, colorName) => {
                      return (
                        <Color
                          style={{
                            backgroundColor: color,
                            border:
                              color === '#FFFFFF'
                                ? '1px solid #ccc'
                                : '1px solid ' + color,
                          }}
                          onClick={() => pieceClicked('hatColor', colorName)}
                        />
                      );
                    })}
                </ColorContainer>
              </Tabpane>
            );
          })}
        </Tabpanes>
      )}
      <Canvas
        style={{display: 'none'}}
        width="528"
        height="560"
        ref={canvasRef}
      />
    </View>
  );
};

export default Avataaar;
