import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TitleSubtitleModule from './TitleSubtitleModule';
import axios from 'axios';
import { act } from 'react-dom/test-utils';


jest.mock('axios');
beforeEach(() => {
  // Limpia los mocks antes de cada test para evitar estados residuales
  jest.clearAllMocks();

  // Configura el mock de axios.get para devolver una respuesta específica
  axios.get.mockResolvedValue({
    data: [
      { id: '1', lang: 'ES', type: 'title', text: 'Título Mockeado' },
      { id: '2', lang: 'ES', type: 'subtitle', text: 'Subtítulo Mockeado' },
    ],
  });
  axios.put.mockResolvedValue({ data: { success: true } });

});
describe('TitleSubtitleModule', () => {
  it('renders without crashing', () => {
    render(<TitleSubtitleModule sectionId="1" idiomas={['ES']} />);
    expect(screen.getByText(/Guardar Cambios/i)).toBeInTheDocument();
  });

  it('renders titles and subtitles from mocked API call', async () => {
    render(<TitleSubtitleModule sectionId="1" idiomas={['ES']} />);
  
    // Asegúrate de que los inputs se actualicen con los valores mockeados
    const tituloInput = await screen.findByDisplayValue('Título Mockeado');
    const subtituloInput = await screen.findByDisplayValue('Subtítulo Mockeado');
  
    expect(tituloInput).toBeInTheDocument();
    expect(subtituloInput).toBeInTheDocument();
  });

  it('allows user to edit titles and subtitles and submit form', async () => {
    await act(async () => {
      render(<TitleSubtitleModule sectionId="1" idiomas={['ES']} />);
    });

    // Encuentra los campos de entrada por su valor inicial y simula cambios de usuario
    const tituloInput = screen.getByDisplayValue('Título Mockeado');
    const subtituloInput = screen.getByDisplayValue('Subtítulo Mockeado');

    await act(async () => {
      fireEvent.change(tituloInput, { target: { value: 'Nuevo Título' } });
      fireEvent.change(subtituloInput, { target: { value: 'Nuevo Subtítulo' } });
    });

    // Simula el envío del formulario
    await act(async () => {
      fireEvent.click(screen.getByText(/Guardar Cambios/i));
    });

    // Aquí puedes añadir aserciones adicionales para verificar el resultado esperado,
    // como asegurarte de que se llamó a axios.put con los argumentos esperados.
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`http://jmricoma/api/literal/update/section/1`), // URL esperada
      expect.objectContaining({
        lang: 'ES',
        text: expect.any(String), // Aquí puedes ser más específico, como 'Nuevo Título'
        type: expect.any(String), // 'title' o 'subtitle', dependiendo de tu implementación
      }),
      expect.objectContaining({
        withCredentials: true,
      })
    );
  });

  

});
