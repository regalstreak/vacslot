import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    LayoutChangeEvent,
    ScrollView,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';
import {
    Menu,
    TextInput as PaperTextInput,
    useTheme,
} from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface IDropdownItem {
    value: string | number;
    id?: number;
    label?: string;
    custom?: ReactNode;
}

export interface IDropdownProps {
    selectedDropdownItem: IDropdownItem | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    mode?: 'outlined' | 'flat' | undefined;
    inputProps?: TTextInputPropsWithoutTheme;
    dropdownItems: IDropdownItem[] | undefined;
    dropDownContainerMaxHeight?: number;
    activeColor?: string;
    theme?: Theme;
    containerStyle?: StyleProp<ViewStyle>;
    setValue: (value: IDropdownItem) => void;
    onDismiss?: () => void;
}

type TTextInputPropsWithoutTheme = Without<TextInputProps, 'theme'>;

export const Dropdown = (props: IDropdownProps) => {
    const activeTheme = useTheme();
    const {
        onDismiss,
        selectedDropdownItem,
        setValue,
        activeColor,
        mode,
        label,
        placeholder,
        inputProps,
        dropdownItems,
        dropDownContainerMaxHeight,
        theme,
        containerStyle,
    } = props;

    const [inputLayout, setInputLayout] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    });
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchText, setSearchText] = useState<string>();
    const [filterItems, setFilterItems] = useState(dropdownItems);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setInputLayout(event.nativeEvent.layout);
    }, []);

    const onPaperTextInputTouchStart = useCallback(() => {
        setIsDropdownVisible(!isDropdownVisible);
    }, [isDropdownVisible]);

    useEffect(() => {
        setSearchText(
            selectedDropdownItem?.label ??
                selectedDropdownItem?.value.toString(),
        );
    }, [selectedDropdownItem?.label, selectedDropdownItem?.value]);

    const onPaperTextInputChangeText = useCallback(
        (text: string) => {
            setSearchText(text);

            if (!text) {
                setFilterItems(dropdownItems);
                return;
            }

            const listToFilter =
                filterItems && filterItems?.length > 0
                    ? filterItems
                    : dropdownItems;
            setFilterItems(
                listToFilter?.filter((l) =>
                    l.value
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()),
                ),
            );
        },
        [filterItems, dropdownItems],
    );

    const scrollViewStyle: StyleProp<ViewStyle> = useMemo(() => {
        return {
            maxHeight: dropDownContainerMaxHeight || 200,
            position: 'absolute',
            backgroundColor: 'white',
            left: inputLayout?.x,
            width: inputLayout?.width,
            top: inputLayout?.y + inputLayout?.height,
            zIndex: 100,
            flex: 1,
        };
    }, [dropDownContainerMaxHeight, inputLayout]);

    const onDropdownDismiss = useCallback(() => {
        onDismiss && onDismiss();
    }, [onDismiss]);

    const onMenuItemPress = useCallback(
        (item) => {
            setValue(item);
            setSearchText(item.label ?? item.value);
            setIsDropdownVisible(false);
            onDropdownDismiss();
        },
        [onDropdownDismiss, setValue],
    );

    return (
        <View style={containerStyle}>
            <View onLayout={onLayout}>
                <PaperTextInput
                    value={searchText}
                    mode={mode}
                    label={label}
                    placeholder={placeholder}
                    theme={theme}
                    onTouchStart={onPaperTextInputTouchStart}
                    onBlur={() => {
                        setIsDropdownVisible(false);
                    }}
                    onChangeText={onPaperTextInputChangeText}
                    right={
                        inputProps?.right ? (
                            inputProps?.right
                        ) : (
                            <PaperTextInput.Icon
                                name={
                                    isDropdownVisible ? 'menu-up' : 'menu-down'
                                }
                                onPress={onPaperTextInputTouchStart}
                            />
                        )
                    }
                    {...inputProps}
                />
            </View>
            {isDropdownVisible && (
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    style={scrollViewStyle}
                    nestedScrollEnabled
                >
                    {filterItems?.map((item, index) => {
                        return (
                            <Menu.Item
                                key={index}
                                titleStyle={{
                                    color:
                                        selectedDropdownItem?.value ===
                                        item.value
                                            ? activeColor ||
                                              (theme || activeTheme).colors
                                                  .primary
                                            : (theme || activeTheme).colors
                                                  .text,
                                }}
                                onPress={() => {
                                    onMenuItemPress(item);
                                }}
                                title={item.custom ?? item.label ?? item.value}
                                style={{ maxWidth: inputLayout?.width }}
                            />
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};
