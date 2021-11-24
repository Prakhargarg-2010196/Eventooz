import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import { BaseUrl } from "../../../../../../../../../api/services/BaseUrl";
import { DragNDrop } from "../DragNDrop/DragNDrop";
import { Loader } from "../../../../../../../../Layout/Loader/Loader";
import crudService from "../../../../../../../../../api/services/crud-service";
import postsService from "../../../../../../../../../api/services/posts.service";
import styles from "./UpdateImagesEvent.module.css";
import { useParams } from "react-router-dom";

const UpdateImagesEvent = () => {
	const [Files, setFilesArray] = useState({});
	const [result, setResult] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [isAdded, setAdded] = useState(false);
	const [message, setMessage] = useState("");
	const [successful, setSuccess] = useState(false);
	let imgPath = [];
	let imageUrlUpdate = [];
	useEffect(() => {
		async function getAllimages() {
			await crudService.Read(id).then(
				(response) => {
					setResult(response.data.post);
					setSuccess(true);
					setLoading(false);
				},
				(error) => {
					let resMessage = "";
					if (!error.response) {
						console.log(JSON.stringify(error.message));
					} else resMessage = error.response.data;
					setSuccess(false);
					setMessage(resMessage);
				}
			);
		}
		getAllimages();
	}, []);

	const { id } = useParams();

	if (result.imageUrl) {
		imgPath = result.imageUrl;
		imageUrlUpdate = imgPath.map((img) => `${BaseUrl()}${img}`);
	}

	const handleDelete = async (e, id, imageUrl) => {
		e.preventDefault();
		await postsService.DeleteImage(id, imageUrl);
		// imageUrlUpdate.filter((image) =>image !==imageUrl )
		const response = await crudService.Read(id);
		setResult(response.data.post);
		
	};

	const handleAdd = async (e, id) => {
		e.preventDefault();
		var FileData = new FormData();
		Files.forEach((file) => {
			FileData.append("files", file);
		});
		setLoading(true);
		await postsService.AddImage(id, FileData).then(
			(response) => {},
			(error) => {
				let resMessage = "";
				if (!error.response) {
					console.log(JSON.stringify(error.message));
				} else resMessage = error.response.data;
				setSuccess(false);
				setMessage(resMessage);
			}
		);
		console.log(isAdded);
		const response = await crudService.Read(id);
		setResult(response.data.post);
		setAdded(true);
		setLoading(false);
	};
	return (
		<>
			{isLoading ? (
				<Loader message={"Your Images are Updating"} />
			) : (
				<Form>
					<Row>
						<Col>
							<Form.Label className={styles.requiredField}>
								Your Images
							</Form.Label>
							<div className="d-flex flex-wrap justify-content-between m-2">
								{imageUrlUpdate.map((image, index) => (
									<div key={index} className="m-3">
										<img
											src={image}
											width={100}
											style={{ margin: "auto" }}
											alt=""
										/>
										<Button
											style={{ width: "100%", marginTop: "10px" }}
											onClick={(e) => {
												handleDelete(e, id, image);
											}}
										>
											{" "}
											Delete
										</Button>
									</div>
								))}
							</div>
						</Col>
						<Col>
							<Form.Label className={styles.requiredField}>
								Browse select one at a time or select multiple or drop multiple{" "}
							</Form.Label>
							{console.log(isAdded)}
							<DragNDrop
								imagesLength={imageUrlUpdate.length}
								onGet={setFilesArray}
								isAdded={isAdded}
							/>
							<Button
								className="w-100"
								onClick={(e) => {
									handleAdd(e, id);
								}}
							>
								Add images
							</Button>
						</Col>
					</Row>
					{message && (
						<div className="form-group mt-4">
							<div className="alert alert-danger" role="alert">
								{message}
							</div>
						</div>
					)}
				</Form>
			)}
		</>
	);
	/* DragDrop END */
};
export default UpdateImagesEvent;
