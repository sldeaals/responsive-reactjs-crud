import React, { useState, useCallback, useMemo, FC } from "react";
import ProceduresContext from "./ProceduresContext";
import { Procedures } from "../types";
import { proceduresDataMock } from "../mocks";
import { isEmptyProcedure } from "../utils";

interface ProceduresProviderProps {
  children: React.ReactNode;
}

const ProceduresProvider: FC<ProceduresProviderProps> = ({ children }) => {
  const [proceduresData, setProceduresData] = useState<Procedures[] | null>(
    null
  );
  const [procedures, setProcedures] = useState<Procedures[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addProcedure = useCallback((newRecord: Procedures) => {
    if (!isEmptyProcedure(newRecord)) {
      setProcedures((prevProcedures) => [...prevProcedures, newRecord]);
    }
  }, []);

  const updateProcedure = useCallback(
    (id: string | number, updatedRecord: Procedures) => {
      setProcedures((prevProcedures) =>
        prevProcedures.map((record) =>
          record.id === id ? updatedRecord : record
        )
      );
    },
    []
  );

  const deleteProcedure = useCallback((id: string | number) => {
    setProcedures((prevProcedures) =>
      prevProcedures.filter((record) => record.id !== id)
    );
  }, []);

  const fetchProcedures = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate fetching data from backend
      const resultData: Procedures[] = await new Promise((resolve) =>
        setTimeout(() => resolve(proceduresDataMock), 200)
      );

      setProceduresData(resultData);
      setProcedures(resultData);
      setError(null);
    } catch (error) {
      console.error("Error fetching procedures:", error);
      setError("Failed to fetch procedures.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProcedureChanges = useCallback(async (records: Procedures[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Saving data to backend simulation
      await new Promise((resolve) => setTimeout(resolve, 200));
      // Re-fetching data from backend simulation
      // await fetchProcedures();
      // Provisionaly
      setProcedures(records);
      setProceduresData(records);
      //
    } catch (error) {
      console.error("Error saving procedure changes:", error);
      setError("Failed to save procedure changes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelProcedureChanges = useCallback(() => {
    setProcedures(proceduresData || []);
  }, [proceduresData]);

  const value = useMemo(
    () => ({
      proceduresData,
      procedures,
      isLoading,
      error,
      addProcedure,
      fetchProcedures,
      updateProcedure,
      deleteProcedure,
      saveProcedureChanges,
      cancelProcedureChanges,
    }),
    [
      proceduresData,
      procedures,
      isLoading,
      error,
      addProcedure,
      fetchProcedures,
      updateProcedure,
      deleteProcedure,
      saveProcedureChanges,
      cancelProcedureChanges,
    ]
  );

  return (
    <ProceduresContext.Provider value={value}>
      {children}
    </ProceduresContext.Provider>
  );
};

export default ProceduresProvider;
