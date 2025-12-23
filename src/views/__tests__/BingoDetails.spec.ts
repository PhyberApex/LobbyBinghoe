import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import BingoDetailsView from '../BingoDetailsView.vue';
import { useRouter } from 'vue-router';

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock the useBingoCard composable
const mockBingoCard = {
  episode: 'Test Episode',
  id: 'test-123',
  isLocal: true,
  bingoValues: Array(5).fill(Array(5).fill(false)),
  bingoFacts: Array(5).fill(Array(5).fill('Test fact')),
}

const mockUseBingoCard = vi.fn(() => ({
  loading: false,
  bingoCard: ref(mockBingoCard),
  fetchCard: vi.fn(),
  bingoFound: ref(false),
  lobbyHoeBingoFound: ref(false),
  removeCardFromStorage: vi.fn(),
}))

vi.mock('@/composables/useBingoCard', () => ({
  default: () => mockUseBingoCard()
}))

describe('BingoDetailsView.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mount component with required props
    wrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Episode');
    expect(wrapper.text()).toContain('test-123');
  });

  it('creates a 5x5 grid of buttons', () => {
    const buttons = wrapper.findAll('.square-btn');
    expect(buttons).toHaveLength(25);
  });

  it('displays numbers 1-25 in the grid', () => {
    const buttons = wrapper.findAll('.square-btn');
    buttons.forEach((button, index) => {
      expect(button.text()).toBe(`${index + 1}`);
    });
  });

  it('creates reference items list', () => {
    const referenceItems = wrapper.findAll('.reference-list .q-item');
    expect(referenceItems).toHaveLength(25);
  });

  it('toggles field when clicking grid button', async () => {
    const button = wrapper.findAll('.square-btn')[0];
    if (!button) throw new Error('Button not found')
    await button.trigger('click');

    expect(mockUseBingoCard().bingoCard.value.bingoValues[0][0]).toBe(true);
  });

  it('toggles field when clicking reference item', async () => {
    const referenceItem = wrapper.findAll('.reference-list .q-item')[0];
      if (!referenceItem) throw new Error('ReferenceItem not found')
    await referenceItem.trigger('click');

    expect(mockUseBingoCard().bingoCard.value.bingoValues[0][0]).toBe(true);
  });

  it('shows loading spinner when loading is true', async () => {
    mockUseBingoCard.mockImplementation(() => ({
      loading: true,
      bingoCard: ref(mockBingoCard),
      fetchCard: vi.fn(),
      bingoFound: ref(false),
      lobbyHoeBingoFound: ref(false),
      removeCardFromStorage: vi.fn(),
    }));

    const loadingWrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });

    expect(loadingWrapper.find('.q-spinner').exists()).toBe(true);
  });

  it('removes card and navigates to home when remove button is clicked', async () => {
    const removeButton = wrapper.find('[icon="delete"]');
    const { removeCardFromStorage } = mockUseBingoCard();
    const router = useRouter();

    await removeButton.trigger('click');

    expect(removeCardFromStorage).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('displays error banner when error occurs', async () => {
    // Mock fetchCard to reject with an error
    mockUseBingoCard.mockImplementation(() => ({
      loading: false,
      bingoCard: ref(mockBingoCard),
      fetchCard: vi.fn().mockRejectedValue(new Error('Test error')),
      bingoFound: ref(false),
      lobbyHoeBingoFound: ref(false),
      removeCardFromStorage: vi.fn(),
    }));

    const errorWrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });

    await vi.runAllTimers();
    expect(errorWrapper.find('.bg-negative').exists()).toBe(true);
    expect(errorWrapper.text()).toContain('Test error');
  });

  it('fetches new card data when id prop changes', async () => {
    const { fetchCard } = mockUseBingoCard();

    await wrapper.setProps({ id: 'new-test-id' });

    expect(fetchCard).toHaveBeenCalledWith('new-test-id');
  });

  it('applies correct styling for selected fields', async () => {
    mockUseBingoCard.mockImplementation(() => ({
      loading: false,
      bingoCard: ref({
        ...mockBingoCard,
        bingoValues: [[true, false, false, false, false], ...Array(4).fill(Array(5).fill(false))]
      }),
      fetchCard: vi.fn(),
      bingoFound: ref(false),
      lobbyHoeBingoFound: ref(false),
      removeCardFromStorage: vi.fn(),
    }));

    const testWrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });

    await testWrapper.vm.$nextTick();

    const selectedButton = testWrapper.findAll('.square-btn')[0];
    const selectedReference = testWrapper.findAll('.reference-list .q-item')[0];

    if (!selectedButton) throw new Error('Button not found')
    if (!selectedReference) throw new Error('SelectedReference not found')
    expect(selectedButton.classes()).toContain('text-white');
    expect(selectedReference.classes()).toContain('bg-positive');
  });

  it('shows bingo notification when bingo is found', async () => {
    mockUseBingoCard.mockImplementation(() => ({
      loading: false,
      bingoCard: ref(mockBingoCard),
      fetchCard: vi.fn(),
      bingoFound: ref(true),
      lobbyHoeBingoFound: ref(false),
      removeCardFromStorage: vi.fn(),
    }));

    const testWrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });

    expect(testWrapper.text()).toContain('Bingo!');
  });

  it('shows lobbyhoe-bingo notification when lobbyhoe bingo is found', async () => {
    mockUseBingoCard.mockImplementation(() => ({
      loading: false,
      bingoCard: ref(mockBingoCard),
      fetchCard: vi.fn(),
      bingoFound: ref(false),
      lobbyHoeBingoFound: ref(true),
      removeCardFromStorage: vi.fn(),
    }));

    const testWrapper = mount(BingoDetailsView, {
      props: {
        id: 'test-123'
      }
    });

    expect(testWrapper.text()).toContain('LobbyHoe-Bingo!');
  });
});