import * as migration_20261026_214627_add_kantor_layanan_kantor from './20261026_214627_add_kantor_layanan_kantor';
import * as migration_20261027_000001_add_homepage_layout_route from './20261027_000001_add_homepage_layout_route';
import * as migration_20261027_000002_add_services_sort_order from './20261027_000002_add_services_sort_order';
import * as migration_20261027_000003_add_homepage_content_fields from './20261027_000003_add_homepage_content_fields';
import * as migration_20261027_000004_remove_legacy_service_content from './20261027_000004_remove_legacy_service_content';
import * as migration_20261028_000005_add_service_benefit_groups from './20261028_000005_add_service_benefit_groups';
import * as migration_20261028_000006_add_content_placement from './20261028_000006_add_content_placement';
import * as migration_20261028_000007_comparison_neutral_status from './20261028_000007_comparison_neutral_status';
import * as migration_20261028_000008_rename_page_layout_collection from './20261028_000008_rename_page_layout_collection';

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
  {
    up: migration_20261027_000004_remove_legacy_service_content.up,
    down: migration_20261027_000004_remove_legacy_service_content.down,
    name: '20261027_000004_remove_legacy_service_content'
  },
  {
    up: migration_20261028_000005_add_service_benefit_groups.up,
    down: migration_20261028_000005_add_service_benefit_groups.down,
    name: '20261028_000005_add_service_benefit_groups'
  },
  {
    up: migration_20261028_000006_add_content_placement.up,
    down: migration_20261028_000006_add_content_placement.down,
    name: '20261028_000006_add_content_placement'
  },
  {
    up: migration_20261028_000007_comparison_neutral_status.up,
    down: migration_20261028_000007_comparison_neutral_status.down,
    name: '20261028_000007_comparison_neutral_status'
  },
  {
    up: migration_20261028_000008_rename_page_layout_collection.up,
    down: migration_20261028_000008_rename_page_layout_collection.down,
    name: '20261028_000008_rename_page_layout_collection'
  },
];
