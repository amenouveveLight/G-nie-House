import { useLayoutEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useData } from '../../Contexts/DataContext';
import { normalizeCollections, dataScope } from '../../Data/normalize';

/**
 * Injecte dans l'état du front les données envoyées par Laravel pour la page courante.
 * Placé dans les layouts ; la première page est déjà appliquée par DataProvider.
 */
export default function ServerHydrator() {
  const { props, component } = usePage();
  const { dispatch } = useData();

  useLayoutEffect(() => {
    const payload = normalizeCollections(props);
    if (Object.keys(payload).length) {
      dispatch({ type: 'HYDRATE', payload, scope: dataScope(component, props) });
    }
  }, [props, component, dispatch]);

  return null;
}
