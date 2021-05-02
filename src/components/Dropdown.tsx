import React, { ReactNode, useCallback, useMemo, useState } from 'react';
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

export interface IListItem {
    label: string;
    value: string | number;
    custom?: ReactNode;
}

export interface IDropdownProps {
    value: string | number | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    mode?: 'outlined' | 'flat' | undefined;
    inputProps?: TTextInputPropsWithoutTheme;
    listItems: IListItem[];
    dropDownContainerMaxHeight?: number;
    activeColor?: string;
    theme?: Theme;
    setValue: (value: string | number) => void;
    onDismiss?: () => void;
}

type TTextInputPropsWithoutTheme = Without<TextInputProps, 'theme'>;

export const Dropdown = (props: IDropdownProps) => {
    const activeTheme = useTheme();
    const {
        onDismiss,
        value,
        setValue,
        activeColor,
        mode,
        label,
        placeholder,
        inputProps,
        listItems: list,
        dropDownContainerMaxHeight,
        theme,
    } = props;

    const [inputLayout, setInputLayout] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    });
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchText, setSearchText] = useState<string>();
    const [filterItems, setFilterItems] = useState(list);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setInputLayout(event.nativeEvent.layout);
    }, []);

    const onPaperTextInputTouchStart = useCallback(() => {
        setIsDropdownVisible(true);
    }, []);

    const onPaperTextInputChangeText = useCallback(
        (text: string) => {
            setSearchText(text);
            if (!text) {
                setFilterItems(list);
                return;
            }
            const listToFilter = filterItems.length > 0 ? filterItems : list;
            setFilterItems(
                listToFilter.filter(l =>
                    l.value
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()),
                ),
            );
        },
        [filterItems, list],
    );

    const menuStyle: StyleProp<ViewStyle> = useMemo(() => {
        return {
            maxWidth: inputLayout?.width,
            width: inputLayout?.width,
            marginTop: inputLayout?.height,
            alignItems: 'stretch',
        };
    }, [inputLayout?.height, inputLayout?.width]);

    const onDropdownDismiss = useCallback(() => {
        onDismiss && onDismiss();
    }, [onDismiss]);

    const onMenuItemPress = useCallback(
        item => {
            setValue(item.value);
            setSearchText(item.label ?? item.value);
            setIsDropdownVisible(false);
            onDropdownDismiss();
        },
        [onDropdownDismiss, setValue],
    );

    return (
        <Menu
            visible={isDropdownVisible}
            onDismiss={onDropdownDismiss}
            theme={theme}
            anchor={
                <View onLayout={onLayout}>
                    <PaperTextInput
                        value={searchText}
                        mode={mode}
                        label={label}
                        placeholder={placeholder}
                        theme={theme}
                        onTouchStart={onPaperTextInputTouchStart}
                        onChangeText={onPaperTextInputChangeText}
                        right={
                            inputProps?.right ? (
                                inputProps?.right
                            ) : (
                                <PaperTextInput.Icon name='menu-down' />
                            )
                        }
                        {...inputProps}
                    />
                </View>
            }
            style={menuStyle}
        >
            <ScrollView
                keyboardShouldPersistTaps='handled'
                style={{ maxHeight: dropDownContainerMaxHeight || 200 }}
            >
                {filterItems.map((item, index) => {
                    return (
                        <Menu.Item
                            key={index}
                            titleStyle={{
                                color:
                                    value === item.value
                                        ? activeColor ||
                                          (theme || activeTheme).colors.primary
                                        : (theme || activeTheme).colors.text,
                            }}
                            onPress={() => {
                                onMenuItemPress(item);
                            }}
                            title={item.custom || item.label}
                            style={{ maxWidth: inputLayout?.width }}
                        />
                    );
                })}
            </ScrollView>
        </Menu>
    );
};
