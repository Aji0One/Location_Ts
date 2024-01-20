// GeoLocation.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import GeoLocation from './GeoLocation';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

jest.mock('leaflet', () => ({
    Icon: jest.fn(),
    icon: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),

}));

describe("Geolocation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("initial render of the component", () => {
        (useLocation as jest.Mock).mockReturnValue({
            state: [{
                name: 'City1',
                time: 'Timestamp1',
                id: '1',
                suburb: 'Suburb1',
                lat: '12.34',
                lng: '56.78',
            }]
        });
        render(<MemoryRouter>
            <GeoLocation />
        </MemoryRouter>);

        const mapCont = screen.getByText("Suburb1");
        // screen.debug()
        expect(mapCont).toBeInTheDocument();

    })
})