import type { Meta, StoryObj } from '@storybook/react';
import Pagination, { type PaginationProps } from '@meowkit/components/pagination';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Layout/Pagination',
  component: Pagination,
  args: {
    currentPageIndex: 2,
    pagesCount: 5,
    onChange: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function InteractivePagination(args: PaginationProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(args.currentPageIndex);
  return (
    <Pagination
      {...args}
      currentPageIndex={currentPageIndex}
      onChange={(pageIndex) => {
        setCurrentPageIndex(pageIndex);
        args.onChange(pageIndex);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractivePagination {...args} />,
};
export const FirstPage: Story = {
  args: { currentPageIndex: 1, pagesCount: 4 },
};
export const LastPage: Story = {
  args: { currentPageIndex: 4, pagesCount: 4 },
};
export const CustomAriaLabels: Story = {
  args: {
    ariaLabels: { next: 'Go forward', previous: 'Go back', page: 'Go to page' },
  },
};
