import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Version } from "../types";
import { getNoteVersion } from "../services/notes";

function NoteVersion() {
  const params = useParams();
  const noteId = params.id;
  if (!noteId) return <div>NoteId not provided.</div>;

  const [versions, setVersion] = useState<Version[]>([]);

  useEffect(() => {
    getNoteVersion(noteId).then((version) => {
      setVersion(version);
    });
  }, [noteId]);

  return (
    <div>
      <h3>Notes changes</h3>
      <table>
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Old Value</th>
            <th>New Value</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td>{version.colname}</td>
              <td className="multi-line-text">{version.oldval}</td>
              <td className="multi-line-text">{version.newval}</td>
              <td>{version.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoteVersion;
