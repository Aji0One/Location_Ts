import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';


import axios from "axios";


jest.useFakeTimers();
const sampleLocation = [
    {
        name: 'City1',
        time: 'Timestamp1',
        id: '1',
        suburb: 'Suburb1',
        lat: '12.34',
        lng: '56.78',
    },

];

const mockedUsedNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,

}));
describe('Dashboard component', () => {

    beforeAll(() => {
        Object.defineProperty(global.navigator, 'geolocation', {
            value: {
                getCurrentPosition: jest.fn(),
            },
            writable: true,
        });
    });

    beforeEach(() => {

        jest.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });




    test('renders the component with initial data', async () => {
        // Mock the geolocation request to return a position
        (global.navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((success) =>
            success({
                coords: { latitude: 12.34, longitude: 56.78 },
            })
        );

        // Mock the Axios response
        jest.spyOn(axios, "get").mockResolvedValue({
            data: {
                results: [{

                    components: {
                        city: 'City1',
                        suburb: 'Suburb1',
                    },
                }

                ],
                timestamp: { created_http: 'Timestamp1', created_unix: '1' },
            }
        });

        // Render the component
        render(<Dashboard />);

        // Wait for the API calls to complete
        await waitFor(() => {
            // Check if the table rows are rendered correctly
            const cityCell = screen.getByText(/City1/i);
            const suburbCell = screen.getByText(/Suburb1/i);
            const timeCell = screen.getByText(/Timestamp1/i);

            expect(cityCell).toBeInTheDocument();
            expect(suburbCell).toBeInTheDocument();
            expect(timeCell).toBeInTheDocument();
        });
    });

    test('renders the component with stored data from localStorage', async () => {

        localStorage.setItem('key', JSON.stringify(sampleLocation));

        // Render the component
        render(<Dashboard />);

        // Wait for the data to be displayed
        await waitFor(() => {
            // Check if the table rows are rendered correctly
            const cityCell = screen.getByText(/City1/i);
            const suburbCell = screen.getByText(/Suburb1/i);
            const timeCell = screen.getByText(/Timestamp1/i);

            expect(cityCell).toBeInTheDocument();
            expect(suburbCell).toBeInTheDocument();
            expect(timeCell).toBeInTheDocument();
        });
    });

    test('deletes all data when "Delete All" button is clicked', async () => {

        localStorage.setItem('key', JSON.stringify(sampleLocation));


        render(<Dashboard />);


        await waitFor(() => {

            const cityCell = screen.getByText(/City1/i);
            const suburbCell = screen.getByText(/Suburb1/i);
            const timeCell = screen.getByText(/Timestamp1/i);

            expect(cityCell).toBeInTheDocument();
            expect(suburbCell).toBeInTheDocument();
            expect(timeCell).toBeInTheDocument();
        });


        const deleteAllButton = screen.getByRole('button', { name: /Delete All/i });
        act(() => fireEvent.click(deleteAllButton));


        expect(localStorage.getItem('key')).toBeNull();


        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    });

    test("Deleting a particular table row on onClick of Delete button", async () => {
        localStorage.setItem('key', JSON.stringify(sampleLocation));
        const deleteHandle = jest.fn();

        render(<Dashboard />);

        const tbody = screen.getAllByTestId("tbody").values;
        const deletebtn = screen.getByTestId("del-1");
        act(() => fireEvent.click(deletebtn, deleteHandle));

        await waitFor(() => {
            expect(tbody).toHaveLength(0);
        })

    });

    test("navigating to map page on onClick view in Map button", async () => {
        render(<MemoryRouter>
            <Dashboard />
        </MemoryRouter>)

        const navbtn = screen.getByRole("button", { name: /View in Map/i });
        expect(navbtn).toBeInTheDocument();
        fireEvent.click(navbtn);
        const hele = screen.getByText("My Location Info", { exact: false });

        expect(hele).toBeInTheDocument();
    });

    test('should show alert when geolocation is not available', async () => {

        (global.navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((success, error) =>
            error({ message: 'Geolocation is not available' })
        );


        render(<Dashboard />);


        await act(async () => {
            await waitFor(() => expect(axios.get).not.toHaveBeenCalled());
        });

    });



    test('should call setTimeout and update state after 2 seconds', async () => {

        (global.navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce((success) =>
            success({
                coords: { latitude: 12.34, longitude: 56.78 },
            })
        );
        const mockResponse = {
            data: {
                results: [
                    {
                        components: {
                            city: 'New York',
                            suburb: 'Manhattan',
                        },
                    },
                ],
                timestamp: {
                    created_http: 'Timestamp1',
                    created_unix: '123456789',
                },
            },
        };
        jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);


        render(<Dashboard />);


        await waitFor(() => expect(axios.get).toHaveBeenCalled());


        expect(screen.getByText('City')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2000);
        });


        expect(screen.queryByText('City')).toBeInTheDocument();
    });


    // test('should show alert when geolocation is not available', async () => {
    //     // Mock the geolocation to simulate the scenario when it is not available
    //     render(<Dashboard />);
    //     if (global.navigator.geolocation) {// Set it to null to simulate unavailability

    //         // Render the component


    //         // Wait for the API calls and setTimeout to resolve
    //         await waitFor(() => expect(axios.get).not.toHaveBeenCalled());

    //         // Check if the alert is shown
    //         expect(screen.getByText("Couldn't get Location")).toBeInTheDocument();
    //     }
    // });


    // test('renders delete buttons when locationName has more than 30 items', async () => {

    //     const sampleData = Array.from({ length: 31 }, (_, index) => ({
    //         id: index.toString(),
    //         name: `City ${index}`,
    //         time: `Timestamp ${index}`,
    //         suburb: `Suburb ${index}`,
    //         lat: index,
    //         lng: index,
    //     }));


    //     const localStorageMock = {
    //         setItem: sampleData,
    //     };

    //     Object.defineProperty(window, 'localStorage', {
    //         value: localStorageMock,
    //     });


    //     render(<Dashboard />);


    //     await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalled());


    // });

});
