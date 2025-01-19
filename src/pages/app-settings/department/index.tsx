import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDepartment } from "./utils";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { settingsCollectionRef } from "@/db/firebase.db";

const Department = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const docRef = doc(settingsCollectionRef, "app-settings");
    const unscubscribe = onSnapshot(docRef, (snapshot) => {
      if (Array.isArray(snapshot.data()?.departments)) {
        setData(snapshot.data()?.departments);
      }
    });

    return () => {
      unscubscribe();
    };
  }, []);

  return (
    <DataTable
      data={data}
      columns={columns}
      elements={[<CreateDepartment />]}
    />
  );
};

export default Department;
