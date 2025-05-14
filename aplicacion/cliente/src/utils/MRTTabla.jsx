import { memo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const MRTTabla = memo(function MRTTabla({
  columns,
  data,
  title,
  initialState = {},
  loading = false,
  rowStylesCallback,
  enableColumnFilterModes = true,
  enableDensityToggle = false,
  enableColumnPinning = true,
}) {
  return (
    <div className="tabla border rounded shadow-sm p-3 bg-light mt-4 mb-4">
      {title && <h4 className="text-center">{title}</h4>}
      <MaterialReactTable
        localization={MRT_Localization_ES}
        columns={columns}
        data={data}
        state={{ ...(loading && { isLoading: true }) }}
        enableRowVirtualization={true}
        enableColumnFilterModes={enableColumnFilterModes}
        enableDensityToggle={enableDensityToggle}
        enableColumnPinning={enableColumnPinning}
        initialState={{
          density: 'compact',
          pagination: { pageIndex: 0, pageSize: 25 },
          showColumnFilters: true,
          ...initialState,
        }}
        muiTableBodyRowProps={({ row }) =>
          rowStylesCallback ? rowStylesCallback(row) : {}
        }
      />
    </div>
  );
});

export default MRTTabla;