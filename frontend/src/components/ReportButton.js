export default function ReportButton({ postId }) {
    const handleReport = () => {
        alert(`Post ${postId} has been reported.`);
    };

    return (
        <button
            onClick={handleReport}
            className="text-red-500 text-sm mt-2 hover:text-red-700">
            🚩 Report
        </button>
    );
}
