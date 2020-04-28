import {m} from 'malevic';
import {getContext} from 'malevic/dom';

interface DropDownProps {
    class?: string;
    selected: string;
    hexColor: string;
    onChange: (value: string) => void;
}

export default function Color_DropDown(props: DropDownProps) {
    const context = getContext();
    const store = context.store as {
        isOpen: boolean;
        listNode: HTMLElement;
        selectedNode: HTMLElement;
    };
    const values = ['auto', props.hexColor];

    function saveListNode(el: HTMLElement) {
        store.listNode = el;
    }

    function saveSelectedNode(el: HTMLElement) {
        store.selectedNode = el;
    }

    function onSelectedClick() {
        store.isOpen = !store.isOpen;
        context.refresh();

        if (store.isOpen) {
            const onOuterClick = (e: MouseEvent) => {
                window.removeEventListener('mousedown', onOuterClick, false);

                const listRect = store.listNode.getBoundingClientRect();
                const ex = e.clientX;
                const ey = e.clientY;
                if (
                    ex < listRect.left ||
                    ex > listRect.right ||
                    ey < listRect.top ||
                    ey > listRect.bottom
                ) {
                    store.isOpen = false;
                    context.refresh();
                }
            };
            window.addEventListener('mousedown', onOuterClick, false);
        }
    }

    function createListItem(value: string) {
        if (value.startsWith('#')) {
            return (
                <div style="width: 100%; height:100%">
                    <div class="color-div" style={'background-color: ' + value}/>
                    <span
                        class={{
                            'color-dropdown__list__item': true,
                            'color-dropdown__list__item--selected': value === props.selected,
                            [props.class]: props.class != null,
                        }}
                        onclick={() => {
                            store.isOpen = false;
                            context.refresh();
                            props.onChange(value);
                        }}
                    >
                        {value}
                    </span>
                </div>
            );
        } else {
            return (
                <span
                    class={{
                        'color-dropdown__list__item': true,
                        'color-dropdown__list__item--selected': value === props.selected,
                        [props.class]: props.class != null,
                    }}
                    onclick={() => {
                        store.isOpen = false;
                        context.refresh();
                        props.onChange(value);
                    }}
                >
                    {value}
                </span>
            );
        }
    }

    return (
        <span
            class={{
                'color-dropdown': true,
                'color-dropdown--open': store.isOpen,
                [props.class]: Boolean(props.class),
            }}
        >
            <span
                class="color-dropdown__list"
                oncreate={saveListNode}
            >
                {values
                    .slice()
                    .sort((a, b) => a === props.selected ? -1 : b === props.selected ? 1 : 0)
                    .map(createListItem)}
            </span>
            <span
                class="color-dropdown__selected"
                oncreate={saveSelectedNode}
                onclick={onSelectedClick}
            >
                <span class="color-dropdown__selected__text">
                    {props.selected}
                </span>
            </span>
        </span >
    );
}