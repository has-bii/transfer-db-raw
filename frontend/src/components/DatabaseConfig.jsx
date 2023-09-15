import PropTypes from "prop-types";
import Modal from "./Modal";
import { useRef, useState } from "react";
import axios from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "./ToastProvider";
import Dropdown from "./Dropdown";
import formatDate from "../../lib/convertDate";
import Sqls from "./Sqls";

function DatabaseConfig({
  database,
  index,
  newTable,
  setNewTable,
  updateConnectionSourceHandler,
  updateConnectionTargetHandler,
  updateTableProperty,
  setColumnsModal,
  setNewColumns,
  addNewTable,
  setSelected,
  delTables,
  delDatabaseHandler,
  setSelectedTable,
  intervals = null,
  saveConfigs,
}) {
  const { pushToast } = useToast();
  const [delModal, setDelModal] = useState(false);
  const [delDB, setDelDB] = useState({ dbIndex: "", connection: {} });
  const [loadingSource, setLoadingSource] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [errorSource, setErrorSource] = useState(false);
  const [errorTarget, setErrorTarget] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("");

  function checkConnection(connection, setLoad, setError) {
    async function check() {
      setLoad(true);

      const res = await axios
        .post("/config/check-connection", {
          connection: JSON.stringify(connection),
        })
        .then((res) => {
          setError(false);
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setError(true);
          return null;
        })
        .finally(() => setLoad(false));

      if (res) pushToast(res.ok, res.message);
      else pushToast(false, `Failed to connect to ${connection.database}`);
    }

    check();
  }

  return (
    <>
      <Modal header="Delete Database" show={delModal} setShow={setDelModal}>
        <div>
          <p>
            Are you sure you want to delete{" "}
            {Object.keys(delDB.connection).length > 0
              ? delDB.connection.source.database
              : ""}{" "}
            DB?
          </p>
        </div>
        <div>
          <button
            className="btn green"
            onClick={() => {
              setDelDB({ dbIndex: "", connection: {} });
              setDelModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="btn red"
            onClick={() => {
              delDatabaseHandler(delDB.dbIndex);
              setDelModal(false);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
      <div className="database-container">
        <div className="connection">
          <div className="source">
            <h4 className="heading">Source</h4>
            <div className={`connection-wrapper ${errorSource ? "error" : ""}`}>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-database-" + index}>Database</label>
                <input
                  id={"source-database-" + index}
                  type="text"
                  placeholder="Database"
                  value={database.connection.source.database}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "database");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-user-" + index}>User</label>
                <input
                  id={"source-user-" + index}
                  type="text"
                  placeholder="User"
                  value={database.connection.source.user}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "user");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-password-" + index}>Password</label>
                <input
                  id={"source-password-" + index}
                  type="text"
                  placeholder="Password"
                  value={database.connection.source.password}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "password");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-host-" + index}>Host</label>
                <input
                  id={"source-host-" + index}
                  type="text"
                  placeholder="Host"
                  value={database.connection.source.host}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "host");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-port-" + index}>Port</label>
                <input
                  id={"source-port-" + index}
                  type="number"
                  placeholder="1521"
                  value={database.connection.source.port}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "port");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"source-dialect-" + index}>Dialect</label>
                <select
                  id={"source-dialect-" + index}
                  value={database.connection.source.dialect}
                  onChange={(e) => {
                    updateConnectionSourceHandler(e, index, "dialect");
                  }}
                >
                  <option value="oracle">oracle</option>
                </select>
              </div>
              <div className="btn-container">
                <button
                  className="btn yellow"
                  onClick={() =>
                    checkConnection(
                      database.connection.source,
                      setLoadingSource,
                      setErrorSource
                    )
                  }
                  disabled={loadingSource}
                >
                  test connection
                  {loadingSource && (
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className=" animate-spin"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="target">
            <h4 className="heading">Target</h4>
            <div className={`connection-wrapper ${errorTarget ? "error" : ""}`}>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-database-" + index}>Database</label>
                <input
                  id={"target-database-" + index}
                  type="text"
                  placeholder="Database"
                  value={database.connection.target.database}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "database");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-user-" + index}>User</label>
                <input
                  id={"target-user-" + index}
                  type="text"
                  placeholder="User"
                  value={database.connection.target.user}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "user");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-password-" + index}>Password</label>
                <input
                  id={"target-password-" + index}
                  type="text"
                  placeholder="Password"
                  value={database.connection.target.password}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "password");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-host-" + index}>Host</label>
                <input
                  id={"target-host-" + index}
                  type="text"
                  placeholder="Host"
                  value={database.connection.target.host}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "host");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-port-" + index}>Port</label>
                <input
                  id={"target-port-" + index}
                  type="number"
                  placeholder="5432"
                  value={database.connection.target.port}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "port");
                  }}
                  required
                />
              </div>
              <div className="connection-input-wrapper">
                <label htmlFor={"target-dialect-" + index}>Dialect</label>
                <select
                  id={"target-dialect-" + index}
                  value={database.connection.target.dialect}
                  onChange={(e) => {
                    updateConnectionTargetHandler(e, index, "dialect");
                  }}
                >
                  <option value="postgres">postgres</option>
                </select>
              </div>
              <div className="btn-container">
                <button
                  className="btn yellow"
                  onClick={() =>
                    checkConnection(
                      database.connection.target,
                      setLoadingTarget,
                      setErrorTarget
                    )
                  }
                  disabled={loadingTarget}
                >
                  test connection
                  {loadingTarget && (
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className=" animate-spin"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="tables">
          <h4 className="heading">Tables</h4>
          <div className="tables-wrapper enable-overflow">
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Source Table</th>
                  <th scope="col">Target Table</th>
                  <th scope="col">filtered source col</th>
                  <th scope="col">filtered target col</th>
                  <th scope="col">filtered col type</th>
                  <th scope="col">Columns</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {database.tables.map((table, i) => (
                  <tr key={i}>
                    <th scope="row" className=" whitespace-nowrap">
                      {i + 1}
                    </th>
                    <td>
                      <input
                        type="text"
                        value={table.sourceTable}
                        onChange={(e) =>
                          updateTableProperty(
                            index,
                            i,
                            "sourceTable",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={table.targetTable}
                        onChange={(e) =>
                          updateTableProperty(
                            index,
                            i,
                            "targetTable",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={table.filterByCol.source}
                        onChange={(e) =>
                          updateTableProperty(
                            index,
                            i,
                            "source",
                            e.target.value,
                            true
                          )
                        }
                      >
                        {table.columns.map((column, index) => (
                          <option key={index} value={column.source}>
                            {column.source}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={table.filterByCol.target}
                        onChange={(e) =>
                          updateTableProperty(
                            index,
                            i,
                            "target",
                            e.target.value,
                            true
                          )
                        }
                      >
                        {table.columns.map((column, index) => (
                          <option key={index} value={column.target}>
                            {column.target}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={table.filterByCol.type}
                        onChange={(e) =>
                          updateTableProperty(
                            index,
                            i,
                            "type",
                            e.target.value,
                            true
                          )
                        }
                      >
                        <option value="PRIMARYKEY">PRIMARYKEY</option>
                        <option value="TIMESTAMP">TIMESTAMP</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn fluid sky"
                        onClick={() => {
                          setSelected({ dbIndex: index, tableIndex: i });
                          setNewColumns([...table.columns]);
                          setColumnsModal(true);
                          setSelectedTable({
                            connection: database.connection,
                            table: {
                              sourceTable: table.sourceTable,
                              targetTable: table.targetTable,
                            },
                          });
                        }}
                      >
                        edit
                      </button>
                    </td>
                    <td>
                      <div className="inline-flex gap-4 items-center w-full">
                        <button
                          className="btn fluid red"
                          onClick={() => delTables(index, i)}
                        >
                          delete
                        </button>

                        {intervals !== null && (
                          <Dropdown position="bottom left">
                            <div className="flex flex-col gap-4 p-4 w-72">
                              <div className="inline-flex gap-4 items-center w-full">
                                <select
                                  className="px-2 py-1 w-full border rounded"
                                  value={selectedInterval}
                                  onChange={(e) =>
                                    setSelectedInterval(e.target.value)
                                  }
                                >
                                  <option value="">Add interval</option>
                                  {intervals.map((int, i) => (
                                    <option key={i} value={i}>
                                      {int.value + " " + int.type}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn md green"
                                  disabled={selectedInterval.length === 0}
                                  onClick={() => {
                                    updateTableProperty(index, i, "intervals", [
                                      ...table.intervals,
                                      intervals[selectedInterval],
                                    ]);
                                    setSelectedInterval("");
                                  }}
                                >
                                  add
                                </button>
                              </div>
                              {table.intervals.length === 0 ? (
                                <div className="mx-auto text-slate-400">
                                  Not running
                                </div>
                              ) : (
                                table.intervals.map((interval, index) => (
                                  <div
                                    key={index}
                                    className="inline-flex px-2 py-1 rounded gap-4 font-semibold items-center w-full justify-between bg-slate-200 text-slate-500"
                                  >
                                    <span>
                                      {interval.value} {interval.type}
                                    </span>
                                    <button
                                      onClick={() => {
                                        updateTableProperty(
                                          index,
                                          i,
                                          "intervals",
                                          table.intervals.filter(
                                            (interval, ii) => ii !== index
                                          )
                                        );
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </Dropdown>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* New TABLE */}
                <tr>
                  <td>#</td>
                  <td>
                    <input
                      type="text"
                      placeholder="source"
                      value={newTable.sourceTable}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          sourceTable: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="target"
                      value={newTable.targetTable}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          targetTable: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={newTable.filterByCol.source}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          filterByCol: {
                            ...newTable.filterByCol,
                            source: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Select Column</option>
                      {newTable.columns.map((col, i) => (
                        <option key={i} value={col.source}>
                          {col.source}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={newTable.filterByCol.target}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          filterByCol: {
                            ...newTable.filterByCol,
                            target: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Select Column</option>
                      {newTable.columns.map((col, i) => (
                        <option key={i} value={col.target}>
                          {col.target}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={newTable.filterByCol.type}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          filterByCol: {
                            ...newTable.filterByCol,
                            type: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="PRIMARYKEY">PRIMARYKEY</option>
                      <option value="TIMESTAMP">TIMESTAMP</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn fluid sky"
                      onClick={() => {
                        setNewColumns(newTable.columns);
                        setColumnsModal(true);
                        setSelectedTable({
                          connection: database.connection,
                          table: {
                            sourceTable: newTable.sourceTable,
                            targetTable: newTable.targetTable,
                          },
                        });
                      }}
                      disabled={
                        newTable.sourceTable.length === 0 ||
                        newTable.targetTable.length === 0
                      }
                    >
                      edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn fluid green"
                      disabled={
                        newTable.sourceTable.length === 0 ||
                        newTable.targetTable.length === 0 ||
                        newTable.filterByCol.source.length === 0 ||
                        newTable.filterByCol.target.length === 0 ||
                        newTable.columns.length === 0
                      }
                      onClick={() => addNewTable(index)}
                    >
                      add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Sqls sqls={database.sqls} />
        <div className="btn-container">
          <button
            className="btn red"
            onClick={() => {
              setDelDB({ dbIndex: index, connection: database.connection });
              setDelModal(true);
            }}
          >
            delete
          </button>
          <button className="btn green" onClick={saveConfigs}>
            save
          </button>
        </div>
      </div>
    </>
  );
}

DatabaseConfig.propTypes = {
  database: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  newTable: PropTypes.object.isRequired,
  setNewTable: PropTypes.func.isRequired,
  updateConnectionSourceHandler: PropTypes.func.isRequired,
  updateConnectionTargetHandler: PropTypes.func.isRequired,
  updateTableProperty: PropTypes.func.isRequired,
  setColumnsModal: PropTypes.func.isRequired,
  setNewColumns: PropTypes.func.isRequired,
  addNewTable: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  delTables: PropTypes.func.isRequired,
  delDatabaseHandler: PropTypes.func.isRequired,
  setSelectedTable: PropTypes.func.isRequired,
  intervals: PropTypes.array,
  saveConfigs: PropTypes.func.isRequired,
};

export default DatabaseConfig;
