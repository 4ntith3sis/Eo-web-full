import * as migration_20261026_214627_add_kantor_layanan_kantor from './20261026_214627_add_kantor_layanan_kantor';
import * as migration_20261027_000001_add_homepage_layout_route from './20261027_000001_add_homepage_layout_route';
import * as migration_20261027_000002_add_services_sort_order from './20261027_000002_add_services_sort_order';
import * as migration_20261027_000003_add_homepage_content_fields from './20261027_000003_add_homepage_content_fields';

export const migrations = [
  {
    up: migration_20261026_214627_add_kantor_layanan_kantor.up,
    down: migration_20261026_214627_add_kantor_layanan_kantor.down,
    name: '20261026_214627_add_kantor_layanan_kantor'
  },
  {
    up: migration_20261027_000001_add_homepage_layout_route.up,
    down: migration_20261027_000001_add_homepage_layout_route.down,
    name: '20261027_000001_add_homepage_layout_route'
  },
  {
    up: migration_20261027_000002_add_services_sort_order.up,
    down: migration_20261027_000002_add_services_sort_order.down,
    name: '20261027_000002_add_services_sort_order'
  },
  {
    up: migration_20261027_000003_add_homepage_content_fields.up,
    down: migration_20261027_000003_add_homepage_content_fields.down,
    name: '20261027_000003_add_homepage_content_fields'
  },
];
