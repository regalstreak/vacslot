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
        setIsDropdownVisible(true);
    }, []);

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
                listToFilter?.filter(l =>
                    l.value
                        .toString()
                        .toLowerCase()
                        .includes(text.toLowerCase()),
                ),
            );
        },
        [filterItems, dropdownItems],
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
            setValue(item);
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
                {filterItems?.map((item, index) => {
                    return (
                        <Menu.Item
                            key={index}
                            titleStyle={{
                                color:
                                    selectedDropdownItem?.value === item.value
                                        ? activeColor ||
                                          (theme || activeTheme).colors.primary
                                        : (theme || activeTheme).colors.text,
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
        </Menu>
    );
};
